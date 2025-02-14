import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, Send, MessageCircle } from "lucide-react";
import { sendMessageToAI, getChatHistory } from "../api_f/kehelot_ai_f";

const Chat = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    if (!accessToken || !userId) {
      navigate("/login");
    } else {
      loadChatHistory();
    }
  }, [navigate]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      if (history && history.length > 0) {
        const formattedHistory = history.map((chat) => ({
          ...chat,
          messages: chat.messages.flatMap((msg, index) => [
            { id: `${chat.history_id}-user-${index}`, text: msg.message, sender: "user" },
            { id: `${chat.history_id}-bot-${index}`, text: msg.response, sender: "bot" }
          ]),
        }));
        setChatHistory(formattedHistory);
        setActiveChat(formattedHistory[0]);
      } else {
        setActiveChat({ messages: [{ id: "default-1", text: "ሰላም! ምን እንድረዳዎ ይፈልጋሉ?", sender: "bot" }] });
      }
    } catch (error) {
      // console.error("Failed to load chat history:", error);
    }
  };


  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload(); // Reloads the page after receiving the response from the backend
    }, 100); // 1 second delay before reload
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
  
    setLoading(true); // Disable sending until response arrives
    const userMessage = { id: `user-${Date.now()}`, text: message, sender: "user" };
    setMessage("");
  
    setActiveChat((prevChat) => {
      const updatedChat = { ...prevChat, messages: [...prevChat.messages, userMessage] };
      return updatedChat;
    });
  
    try {
      const aiResponse = await sendMessageToAI(message);
      if (aiResponse && aiResponse.ai_response) {
        const aiMessage = { id: `bot-${Date.now()}`, text: aiResponse.ai_response, sender: "bot" };
  
        setActiveChat((prevChat) => {
          const updatedChat = { ...prevChat, messages: [...prevChat.messages, aiMessage] };
          setChatHistory((prevHistory) => [
            updatedChat,
            ...prevHistory.filter((c) => c.historyId !== prevChat.historyId),
          ]);
          return updatedChat;
        });
      }
    } catch (error) {
      // console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
    reloadPage();
    setLoading(false); // Enable sending again
  };
  

  return (
    <div className="min-h-screen bg-kihelot-dark flex">
      <aside className={`glass fixed h-full transition-transform ${sidebarOpen ? "translate-x-0 w-96" : "-translate-x-full w-64"}`}>
        <div className="p-4">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Chat History
          </h2>
          {chatHistory.length > 0 ? (
            <div className="space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary">
              {chatHistory.map((chat, chatIndex) => (
                <div key={`${chat.historyId}-${chatIndex}`} className="p-2 rounded hover:bg-white/5 cursor-pointer">
                  <h3 className="text-sm font-medium text-gray-400">
                    {new Date(chat.timestamp).toLocaleString()}
                  </h3>
                  {chat.messages.map((msg, msgIndex) => (
                    <div key={`${msg.id}-${msgIndex}`} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-lg ${msg.sender === "user" ? "bg-primary text-kihelot-dark" : "glass"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">No Chat History</div>
          )}
        </div>
      </aside>

      <div className={`flex-1 ${sidebarOpen ? "ml-96" : "ml-0"} transition-all`}>
        <nav className="glass px-4 py-3 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => navigate("/login")} className="text-primary hover:underline flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>

        <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
          {activeChat?.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-4 rounded-lg ${msg.sender === "user" ? "bg-primary text-kihelot-dark" : "glass"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="glass p-4 absolute bottom-0 left-0 right-0">
          <div className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="በአማርኛ ጽፍ..."
              className="flex-1 bg-transparent glass px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
            />
            <button type="submit" className="px-6 py-2 bg-primary text-kihelot-dark rounded-lg hover-glow flex items-center gap-2" disabled={loading}>
              <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
