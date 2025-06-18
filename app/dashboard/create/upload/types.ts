export type PostType = {
    type: string;
    size: string;
    aspect_ratio: string;
};
  
  
export type Platform = {
    platform: string;
    posts: PostType[];
};


export const socialMediaTypes: Platform[] = [
    {
      platform: "Facebook",
      posts: [
        { type: "Feed Post (Image)", size: "1200x630", aspect_ratio: "1.91:1" },
        { type: "Feed Post (Square)", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Story", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Video Feed", size: "1280x720", aspect_ratio: "16:9" },
        { type: "Carousel", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Marketplace Ad", size: "1200x1200", aspect_ratio: "1:1" },
        { type: "Right Column Ad", size: "1200x628", aspect_ratio: "1.91:1" },
        { type: "Event Cover Photo", size: "1200x628", aspect_ratio: "1.91:1" }
      ]
    },
    {
      platform: "Instagram",
      posts: [
        { type: "Feed Post (Square)", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Feed Post (Portrait)", size: "1080x1350", aspect_ratio: "4:5" },
        { type: "Feed Post (Landscape)", size: "1080x566", aspect_ratio: "1.91:1" },
        { type: "Story", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Reel", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Carousel", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Explore Page", size: "1080x1350", aspect_ratio: "4:5" }
      ]
    },
    {
      platform: "TikTok",
      posts: [
        { type: "Video (Organic/Ad)", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Spark Ad", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "In-Feed Ad", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Top View Ad", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Branded Effect", size: "1080x1920", aspect_ratio: "9:16" }
      ]
    },
    {
      platform: "LinkedIn",
      posts: [
        { type: "Feed Post (Image)", size: "1200x627", aspect_ratio: "1.91:1" },
        { type: "Square Image Ad", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Carousel Ad", size: "1080x1080", aspect_ratio: "1:1" },
        { type: "Video Ad (Vertical)", size: "1080x1920", aspect_ratio: "9:16" },
        { type: "Video Ad (Landscape)", size: "1200x627", aspect_ratio: "1.91:1" },
        { type: "Document Post", size: "variable", aspect_ratio: "variable" }
      ]
    }
];
  