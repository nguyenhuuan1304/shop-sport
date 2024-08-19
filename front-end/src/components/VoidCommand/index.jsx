import React, { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

const VoiceCommand = ({ isVoiceEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [textVoice, setTextVoice] = useState("");
  const useDebounceSearchTerm = useDebounce(textVoice, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "vi-VN";

      recognitionInstance.onstart = () => {
        console.log("Voice recognition started.");
      };

      recognitionInstance.onend = () => {
        console.log("Voice recognition ended.");
        if (isListening) {
          recognitionInstance.start();
        }
      };

      recognitionInstance.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.trim();
        console.log("Transcript:", transcript);
        setTextVoice(transcript);

        if (transcript.toLowerCase() === "hey siri") {
          console.log("Hey Siri detected!");
          setIsListening(false);
        }
      };

      setRecognition(recognitionInstance);
    } else {
      console.log("Speech recognition not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    if (recognition) {
      if (isVoiceEnabled) {
        recognition.start();
        setIsListening(true);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    }
  }, [isVoiceEnabled, recognition]);

  const keywords = [
    "danh sách",
    "giá thấp",
    "giá cao",
    "hot",
    "sale",
    "mới nhất",
    "tìm kiếm",
    "đăng nhập",
    "đăng ký",
    "thông tin tài khoản",
    "sổ địa chỉ",
    "đổi mật khẩu",
    "đơn hàng",
    "liên hệ",
    "trang chủ",
    "chi tiết sản phẩm",
    "adidas",
    "nike",
    "vợt cầu lông",
    "giày cầu lông",
    "hàng đang khuyến mãi",
  ];

  const handleNavigation = (keyword) => {
    switch (keyword) {
      case "danh sách":
        navigate("/products");
        break;
      case "giá thấp":
        navigate("/products?filter=low-price");
        break;
      case "giá cao":
        navigate("/products?filter=high-price");
        break;
      case "hot":
        navigate("/products?filter=hot");
        break;
      case "sale":
        navigate("/products?filter=sale");
        break;
      case "mới nhất":
        navigate("/products?filter=newest");
        break;
      case "tìm kiếm":
        navigate("/search");
        break;
      case "đăng nhập":
        navigate("/login");
        break;
      case "đăng ký":
        navigate("/register");
        break;
      case "thông tin tài khoản":
        navigate("/account");
        break;
      case "sổ địa chỉ":
        navigate("/account/address-book");
        break;
      case "đổi mật khẩu":
        navigate("/account/change-password");
        break;
      case "đơn hàng":
        navigate("/orders");
        break;
      case "liên hệ":
        navigate("/contact");
        break;
      case "trang chủ":
        navigate("/");
        break;
      case "chi tiết sản phẩm":
        navigate("/product-details");
        break;
      case "adidas":
        navigate("/products?brand=adidas");
        break;
      case "nike":
        navigate("/products?brand=nike");
        break;
      case "vợt cầu lông":
        navigate("/products?category=badminton-rackets");
        break;
      case "giày cầu lông":
        navigate("/products?category=badminton-shoes");
        break;
      case "hàng đang khuyến mãi":
        navigate("/products?filter=sale");
        break;
      default:
        console.log("Không tìm thấy trang tương ứng cho từ khóa:", keyword);
    }
  };

  useEffect(() => {
    const searchTermLower = useDebounceSearchTerm.toLowerCase();
    const matchKeyword = keywords.find((keyword) =>
      searchTermLower.includes(keyword)
    );
    if (matchKeyword) {
      console.log("Từ khóa phù hợp được phát hiện:", matchKeyword);
      handleNavigation(matchKeyword);
    }
  }, [useDebounceSearchTerm, navigate]);

  return null;
};

export default VoiceCommand;
