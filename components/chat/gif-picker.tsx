"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface GifPickerProps {
  onSelect: (gifUrl: string) => void;
  onClose: () => void;
}

interface GifResult {
  id: string;
  title: string;
  url: string;
  preview: string;
  width: number;
  height: number;
}

export function GifPicker({ onSelect, onClose }: GifPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  // Sử dụng Giphy API - có public API key
  const GIPHY_API_KEY =
    process.env.NEXT_PUBLIC_GIPHY_API_KEY || "sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh";
  const LIMIT = 20;

  const searchGifs = async (query: string = "", newSearch: boolean = false) => {
    setIsLoading(true);
    try {
      const currentOffset = newSearch ? 0 : offset;
      const endpoint = query.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
            query
          )}&limit=${LIMIT}&offset=${currentOffset}&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${LIMIT}&offset=${currentOffset}&rating=g`;

      console.log("Fetching GIFs from:", endpoint);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("GIF data received:", data.data?.length || 0, "items");

      if (data.data && Array.isArray(data.data)) {
        const transformedGifs: GifResult[] = data.data.map((gif: any) => ({
          id: gif.id,
          title: gif.title || "GIF",
          url: gif.images.fixed_height.url,
          preview: gif.images.fixed_height_small.url,
          width: parseInt(gif.images.fixed_height.width) || 200,
          height: parseInt(gif.images.fixed_height.height) || 200,
        }));

        setGifs(newSearch ? transformedGifs : [...gifs, ...transformedGifs]);
        setOffset(newSearch ? LIMIT : currentOffset + LIMIT);
      } else {
        console.error("Unexpected data format:", data);
        toast.error("Định dạng dữ liệu không đúng");
      }
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      toast.error("Không thể tải GIF. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchGifs("", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!searchQuery.trim()) {
      return;
    }
    setOffset(0);
    searchGifs(searchQuery, true);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSelect(gifUrl);
    onClose();
  };

  return (
    <div className="absolute bottom-full right-0 mb-2 w-[350px] sm:w-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm">Chọn GIF</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form
        onSubmit={handleSearch}
        className="p-3 border-b border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm GIF..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e as any);
              }
            }}
            className="pl-10"
            autoComplete="off"
          />
        </div>
      </form>

      <ScrollArea className="h-[350px] sm:h-[400px]">
        <div className="grid grid-cols-2 gap-2 p-3">
          {gifs.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => handleGifSelect(gif.url)}
              className="relative group overflow-hidden rounded-lg border border-transparent hover:border-blue-500 transition-colors"
            >
              <img
                src={gif.preview}
                alt={gif.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-4 text-sm text-gray-500">
            Đang tải...
          </div>
        )}

        {!isLoading && gifs.length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            Không tìm thấy GIF nào
          </div>
        )}

        {!isLoading && gifs.length > 0 && (
          <div className="text-center py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => searchGifs(searchQuery, false)}
            >
              Tải thêm
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
