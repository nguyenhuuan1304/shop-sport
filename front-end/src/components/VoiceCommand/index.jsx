import React, { useState, useEffect } from 'react';

const VoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'vi-VN';

      recognitionInstance.onstart = () => {
        console.log('Voice recognition started.');
      };

      recognitionInstance.onend = () => {
        console.log('Voice recognition ended.');
        if (!isListening) {
          recognitionInstance.start(); // Tự động khởi động lại khi kết thúc nếu không đang nghe lệnh
        }
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Transcript:', transcript);

        if (transcript.toLowerCase() === 'hey siri' || transcript.toLowerCase() === 'xin chào') {
          console.log('Kích hoạt chế độ lắng nghe!');
          setIsListening(true);
          recognitionInstance.stop();
        } else if (isListening) {
          console.log('Nhận diện lệnh: ', transcript);
          // Thực hiện hành động với câu lệnh người dùng
          setIsListening(false);
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
      recognitionInstance.start(); // Bắt đầu lắng nghe ngay khi khởi động
    } else {
      console.log('Trình duyệt không hỗ trợ SpeechRecognition.');
    }
  }, [isListening]);

  return (
    <div>
      <p>{isListening ? 'Đang lắng nghe câu lệnh...' : 'Đang lắng nghe từ khóa kích hoạt...'}</p>
    </div>
  );
};

export default VoiceCommand;
