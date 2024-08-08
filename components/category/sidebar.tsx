"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const [showMoreChapters, setShowMoreChapters] = useState(false);
  const [ratingExpanded, setRatingExpanded] = useState(true);
  const [chaptersExpanded, setChaptersExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);

  return (
    <aside className="w-64 p-4 bg-white shadow">
      {/* Rating Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => setRatingExpanded(!ratingExpanded)}
        >
          <h3 className="font-semibold">Rating</h3>
          {ratingExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {ratingExpanded && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="5-stars" className="mr-2" />
              <label htmlFor="5-stars" className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    &#9733;
                  </span>
                ))}
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="4-stars" className="mr-2" />
              <label htmlFor="4-stars" className="flex items-center">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    &#9733;
                  </span>
                ))}
                <span className="text-gray-300">&#9733;</span>
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="3-stars" className="mr-2" />
              <label htmlFor="3-stars" className="flex items-center">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    &#9733;
                  </span>
                ))}
                {[...Array(2)].map((_, i) => (
                  <span key={i} className="text-gray-300">
                    &#9733;
                  </span>
                ))}
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="2-stars" className="mr-2" />
              <label htmlFor="2-stars" className="flex items-center">
                {[...Array(2)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    &#9733;
                  </span>
                ))}
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="text-gray-300">
                    &#9733;
                  </span>
                ))}
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="1-star" className="mr-2" />
              <label htmlFor="1-star" className="flex items-center">
                <span className="text-yellow-500">&#9733;</span>
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-gray-300">
                    &#9733;
                  </span>
                ))}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Number of Chapters Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => setChaptersExpanded(!chaptersExpanded)}
        >
          <h3 className="font-semibold">Number of Chapters</h3>
          {chaptersExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {chaptersExpanded && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="1-10" className="mr-2" />
              <label htmlFor="1-10">1-10</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="10-15" className="mr-2" />
              <label htmlFor="10-15">10-15</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="15-20" className="mr-2" />
              <label htmlFor="15-20">15-20</label>
            </div>
            {showMoreChapters && (
              <>
                <div className="flex items-center">
                  <input type="checkbox" id="20-25" className="mr-2" />
                  <label htmlFor="20-25">20-25</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="25-30" className="mr-2" />
                  <label htmlFor="25-30">25-30</label>
                </div>
              </>
            )}
            <button
              className="text-blue-500 text-sm mt-2 flex items-center"
              onClick={() => setShowMoreChapters(!showMoreChapters)}
            >
              {showMoreChapters ? "See Less" : "See More"}{" "}
              {showMoreChapters ? (
                <ChevronUp className="ml-1" />
              ) : (
                <ChevronDown className="ml-1" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => setPriceExpanded(!priceExpanded)}
        >
          <h3 className="font-semibold">Price</h3>
          {priceExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {priceExpanded && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="free" className="mr-2" />
              <label htmlFor="free">Free</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="20" className="mr-2" />
              <label htmlFor="20">$20</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="50" className="mr-2" />
              <label htmlFor="50">$50</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="100" className="mr-2" />
              <label htmlFor="100">$100</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="150" className="mr-2" />
              <label htmlFor="150">$150</label>
            </div>
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center mb-2 cursor-pointer"
          onClick={() => setCategoryExpanded(!categoryExpanded)}
        >
          <h3 className="font-semibold">Category</h3>
          {categoryExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
        {categoryExpanded && (
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" id="chemistry" className="mr-2" />
              <label htmlFor="chemistry">Chemistry</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="biology" className="mr-2" />
              <label htmlFor="biology">Biology</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="design" className="mr-2" />
              <label htmlFor="design">Design</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="coding" className="mr-2" />
              <label htmlFor="coding">Coding</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="music" className="mr-2" />
              <label htmlFor="music">Music</label>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
