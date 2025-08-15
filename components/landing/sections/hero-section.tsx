"use client";

import { Box } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [stats, setStats] = useState({
    peopleJoined: 0,
    gamesSubmitted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { createClient } = await import("@supabase/supabase-js");

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("Missing Supabase environment variables");
          setLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from("user")
          .select("*", { count: "exact", head: true });

        // Fetch games count
        const { count: gamesCount, error: gamesError } = await supabase
          .from("games")
          .select("*", { count: "exact", head: true });

        if (!userError && !gamesError) {
          setStats({
            peopleJoined: userCount || 0,
            gamesSubmitted: gamesCount || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="pt-24 pb-20 px-4 bg-black relative overflow-hidden h-screen">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-pink-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Currently under development
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Manage Your Games
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                With Ease
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed">
              Discover, collaborate, and grow your game idea.
              <br></br>
              Connecting developers and designers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="max@example.com"
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all transform hover:scale-105 cursor-pointer">
                Join Waitlist
              </button>
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-400">
                  {loading ? (
                    <span className="inline-block w-20 h-4 bg-gray-700 rounded animate-pulse"></span>
                  ) : (
                    `${stats.peopleJoined} People Joined`
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-400">
                  {loading ? (
                    <span className="inline-block w-24 h-4 bg-gray-700 rounded animate-pulse"></span>
                  ) : (
                    `${stats.gamesSubmitted} Games Submitted`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Project list */}
          {/* <div className="relative">
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-white font-semibold mb-6 text-sm tracking-wider">
                PROJECTS
              </h3>
              <div className="space-y-4">
                {[
                  { id: "074", name: "better-t-stack.dev", status: "JOINED" },
                  { id: "072", name: "fumadocs.dev", status: "JOINED" },
                  { id: "068", name: "ultracite.ai", status: "JOINED" },
                  { id: "069", name: "analog.now", status: "JOINED" },
                  { id: "070", name: "better-auth.com", status: "JOINED" },
                  { id: "071", name: "useautumn.com", status: "JOINED" },
                  { id: "073", name: "trycomp.ai", status: "JOINED" },
                ].map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 text-sm font-mono">
                        {project.id}
                      </span>
                      <span className="text-gray-300 font-medium">
                        {project.name}
                      </span>
                    </div>
                    <span className="text-green-400 text-xs font-semibold tracking-wider">
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition">
                Submit Early
              </button>
            </div>
          </div> */}
        </div>

        {/* Creator logos */}
        <div className="mt-20 pt-8 border-t border-white/10">
          <p className="text-center text-sm text-gray-500 mb-8">
            CREATED BY PEOPLE BEHIND
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["University Of Macedonia"].map((name, i) => (
              <div
                key={i}
                className="text-gray-600 font-bold text-lg flex items-center space-x-2"
              >
                <Box className="w-5 h-5" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
