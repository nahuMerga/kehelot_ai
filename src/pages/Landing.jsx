// src/pages/Landing.js

import { useState, useEffect } from "react"; // Import hooks for state and effects
import { Link } from "react-router-dom";
import { MessageCircle, Mic, BookOpen, User, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { getHeritageCards } from "../api_f/kehelot_ai_f"; // Import getHeritageCards from api_axios

const Landing = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heritage, setHeritage] = useState([]);

  useEffect(() => {
    const loadHeritageData = async () => {
      try {
        const data = await getHeritageCards(); // Use getHeritageCards from api_axios
        if (data.error) {
          setError(data.error); // Set error if there's an issue with the API response
        } else {
          setHeritage(data); // Set the fetched heritage data
        }
        setLoading(false); // End the loading state
      } catch (err) {
        setError("An error occurred while fetching the data");
        setLoading(false);
      }
    };

    loadHeritageData(); // Trigger the data fetch on component mount
  }, []);

  return (
    <div className="min-h-screen bg-kihelot-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up">
            Welcome to <span className="text-primary">Kehelot.ai</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Your Amharic AI companion for natural conversations
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-kihelot-dark rounded-lg text-lg font-semibold hover-glow animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Get Started</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-kihelot-DEFAULT">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-primary">Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              icon: <MessageCircle className="w-8 h-8 mb-4" />,
              title: "Natural Conversations",
              description: "Engage in fluid Amharic conversations with our AI"
            }, {
              icon: <Mic className="w-8 h-8 mb-4" />,
              title: "Voice Interface (Coming Soon...)",
              description: "Speak and listen in Amharic naturally"
            }, {
              icon: <BookOpen className="w-8 h-8 mb-4" />,
              title: "Learning Assistant",
              description: "Perfect your Amharic language skills"
            }].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 animate-fade-up flex flex-col items-center text-center"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-4 text-primary">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethiopian Heritage Section */}
      <section className="py-20 px-4 bg-kihelot-DEFAULT">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-primary">Ethiopian Heritage</span>
          </h2>

          {loading ? (
            <div className="text-center text-gray-300">Loading...</div> // Show loading message
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Show error if any
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {heritage.map((item, index) => (
                <div
                  key={index}
                  className="glass-card overflow-hidden"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">{item.title}</h3>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Developer Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-primary">About Developer</span>
          </h2>
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <User className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Nahom Merga</h3>
            <p className="text-gray-300 mb-4 text-center">
              Tech enthusiast passionate about bringing natural language AI to the Amharic-speaking community.
            </p>
            <div className="flex justify-center">
              <Link to="/chat" className="flex items-center gap-2 text-primary hover:underline">
                <span>Try Kehelot.ai</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Kehelot.ai. Created by Nahom Merga
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
