"use client";

import React, { useEffect } from "react";

export default function FormattedContent({ content }: { content: string }) {
  // Regex to find Instagram URLs
  const instagramRegex = /(https?:\/\/(www\.)?instagram\.com\/(p|reel)\/([^/?\s]+))/g;

  useEffect(() => {
    // Load Instagram embed script if not present
    if (content.match(instagramRegex)) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [content]);

  const parts = content.split(instagramRegex);

  return (
    <div className="space-y-4 text-gray-300 leading-relaxed max-w-none">
      {content.split("\n\n").map((block, i) => {
        const isInstagram = block.match(instagramRegex);
        
        if (isInstagram) {
          const url = block.match(instagramRegex)![0];
          // Remove trailing slash for consistency
          const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;
          
          return (
            <div key={i} className="my-8 flex justify-center">
              <blockquote 
                className="instagram-media" 
                data-instgrm-captioned 
                data-instgrm-permalink={`${cleanUrl}/?utm_source=ig_embed&amp;utm_campaign=loading`}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: "3px",
                  boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: 0,
                  width: "99.375%",
                }}
              >
              </blockquote>
            </div>
          );
        }

        return <p key={i} className="whitespace-pre-wrap">{block}</p>;
      })}
    </div>
  );
}
