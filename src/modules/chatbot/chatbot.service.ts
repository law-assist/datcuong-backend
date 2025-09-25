import axios, { AxiosError } from 'axios';
import * as dotenv from 'dotenv';

// Define the DTO interface to match FastAPI's QuestionAnsweringParam
interface QuestionAnsweringDto {
  query: string;
  user_id: string;
  chat_id: string;
}

// Define the response interface for question answering (based on FastAPI response)
interface QuestionAnsweringResponse {
  context: Array<{ [key: number]: string }>;
  answer: string;
}

// Define the response interface for chat history (based on FastAPI response)
interface ChatHistoryResponse {
  history: Array<{ human?: string; ai?: string }>;
  errors: string | null;
}

dotenv.config();
// Base URL of your FastAPI server
const API_BASE_URL = process.env.CHAT_HOST; // Adjust based on your FastAPI server

export class ChatBotService {
  constructor() {}

  async questionAnswering(questionAnsweringDto: QuestionAnsweringDto): Promise<string> {
    try {
      const url = `${API_BASE_URL}agents/question-answering`;
    console.log('Chat History URL:', url); // Debugging line to check the URL
      const response = await axios.post(
        `${API_BASE_URL}agents/question-answering`,
        questionAnsweringDto,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Question Answering Response:', response.data.answer); // Debugging line to check the response
      return response.data.answer; // Return only the answer part of the response
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error calling question-answering API:', error.response?.data || error.message);
        throw new Error(`Failed to get answer: ${error.response?.data?.detail || error.message}`);
      }
      throw new Error('Unexpected error occurred while calling question-answering API');
    }
  }

  async getChatHistory(user_id: string, chat_id: string): Promise<any[]> {
    const url= `${API_BASE_URL}/agents/chat-history?user_id=${user_id}&chat_id=${chat_id}`;
    console.log('Chat History URL:', url); // Debugging line to check the URL
    try {
      const response = await axios.get(
        `${API_BASE_URL}agents/chat-history?user_id=${user_id}&chat_id=${chat_id}`,
      );
      return response.data.history; // Return the history array
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error calling chat-history API:', error.response?.data || error.message);
        throw new Error(`Failed to get chat history: ${error.response?.data?.errors || error.message}`);
      }
      throw new Error('Unexpected error occurred while calling chat-history API');
    }
  }
}