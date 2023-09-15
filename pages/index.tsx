import { useRef, useState, useEffect, } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import { Document } from 'langchain/document';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import Link from "next/link";
import axios from 'axios';
import fetch from "cross-fetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [audioFile, setAudioFile] = useState<Blob | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  // const [sound, setSound] = useState<string | null>(null);
  const audioUrlsRef = useRef<string[]>([]);


  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>({
    messages: [
      {
        message: 'Xin chào tôi là Smart Shark, tôi sẽ giúp bạn trả lời các câu hỏi về các quy tắc, quy định của Trường ĐHBK TP HCM',
        type: 'apiMessage',
      },
    ],
    history: [],
  });

  const { messages, history } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  //handle form submission
  async function handleSubmit(e: any) {
    e.preventDefault();

    setError(null);

    if (!query) {
      alert('Vui lòng nhập vào câu hỏi!');
      return;
    }

    const ques = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: 'userMessage',
          message: ques,
        },
      ],
    }));

    setLoading(true);
    setQuery('');

    try {
      const question = ques.trim();
      console.log(question);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
      }
      );
      // console.time(response)

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Translate the response from English to Vietnamese
        const translatedText = await translateText(data.text);
        console.log(translatedText)

        setMessageState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              type: 'apiMessage',
              message: translatedText, // Use the translated text here
              sourceDocs: data.sourceDocuments,
            },
          ],
          history: [...state.history, [question, translatedText]], // Save translated text to history
        }));
      }

      setLoading(false);

      // Scroll to bottom
      messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching the data. Please try again.');
    }
  }

  // Function to translate text using Google Translate API
  async function translateText(text: any) {
    const apiKey = 'AIzaSyCxTVO9c2cPK2Uk-9UBPG3kjOlZ9AlzVn0'; // Replace with your Google Translate API key
    const targetLang = 'vi'; // Target language code for Vietnamese

    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          q: text,
          target: targetLang,
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Error while translating:', error);
      return text; // Return the original text if translation fails
    }
  }

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && query) {
      handleSubmit(e);
    } else if (e.key == 'Enter') {
      e.preventDefault();
    }
  };






  const [isListen, setIsListen] = useState(false);

  const handleListen = () => {
    toggleRecording();
  };
  const toggleRecording = () => {
    if (audioRecorder) {
      if (audioRecorder.state === "recording") {
        stopRecordingAndUpload();
      } else {
        startRecording();
      }
    }
  };


  const audioListRef = ref(storage, "audio/");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setAudioRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            const blob = new Blob([event.data], { type: "audio/wav" });
            setAudioFile(blob);
          }
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone: ", error);
      });
  }, []);
  

  // const startRecording = () => {
  //   if (audioRecorder && audioRecorder.state === "inactive") {
  //     audioRecorder.start();
  //     setIsListen(true);
  //   }
  // };
  const startRecording = () => {
    if (audioRecorder) {
      audioRecorder.start();
      setIsListen(true);
    }
  };
  const stopRecordingAndUpload = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
      uploadAudioFile();
      setIsListen(false);
    }
  };

  const uploadAudioFile = () => {
    if (audioFile == null) return;
    const audioFileName = `recording_${Date.now()}.wav`;
    const audioRef = ref(audioListRef, audioFileName);
    const uploadTask = uploadBytesResumable(audioRef, audioFile);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Đang upload, bạn có thể cập nhật tiến trình tại đây nếu cần
      },
      (error) => {
        // Xử lý lỗi upload nếu có
        console.error("Error uploading audio: ", error);
      },
      () => {
        // Upload hoàn thành, lấy URL của audio và thêm vào mảng audioUrls
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          audioUrlsRef.current = [...audioUrlsRef.current, url]; // Thêm URL mới vào mảng audioUrlsRef
          setAudioUrls(audioUrlsRef.current); // Cập nhật giá trị của audioUrls
          console.log(url);
        });            
      }
    );
  };
  

  useEffect(() => {
    listAll(audioListRef)
      .then((response) => {
        return Promise.all(
          response.items.map((item) => {
            return getDownloadURL(item);
          })
        );
      })
      .then((urls) => {
        setAudioUrls(urls);
      })
      .catch((error) => {
        console.error("Error getting audio URLs: ", error);
      });
  }, []);

  useEffect(() => {
    // Hàm này sẽ chạy mỗi khi audioUrlsRef thay đổi
    console.log("Audio URLs updated:", audioUrlsRef.current);
  }, [audioUrlsRef.current]);

  return (
    <>
      <Layout>
        <header className={styles.header}>
          <div className={styles.container}>
            <div>
              <a>
                <Image
                  src="/logosmartshark.png"
                  alt="Smart Shark"
                  width={200}
                  height={200}
                  style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              </a>
            </div>
            <div className='header-menu'>
              <ul className={styles.menunav}>
                <li className={styles.li}>
                  <a href="" className={styles.index}>TRANG CHỦ</a>
                </li>
                <li className={styles.li}><Link href="/gioithieu" className={styles.navLink}>GIỚI THIỆU</Link></li>
                <li className={styles.li}><Link href="/lienhe" className={styles.navLink}>LIÊN HỆ</Link></li>
              </ul>
            </div>
          </div>
        </header>
        <div className="mx-auto flex flex-col gap-4">
          <main className={styles.main}>
            <div className={styles.cloud}>
              <div ref={messageListRef} className={styles.messagelist}>
                {messages.map((message, index) => {
                  let icon;
                  let className;
                  if (message.type === 'apiMessage') {
                    icon = (
                      <Image
                        key={index}
                        src="/logo.png"
                        alt="AI"
                        width="40"
                        height="40"
                        className={styles.boticon}
                        priority
                      />
                    );
                    className = styles.apimessage;
                  } else {
                    icon = (
                      <Image
                        key={index}
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority
                      />
                    );
                    // The latest message sent by the user will be animated while waiting for a response
                    className =
                      loading && index === messages.length - 1
                        ? styles.usermessagewaiting
                        : styles.usermessage;
                  }
                  return (
                    <>
                      <div key={`chatMessage-${index}`} className={className}>
                        {icon}
                        <div className={styles.markdownanswer}>
                          <ReactMarkdown linkTarget="_blank">
                            {message.message}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {message.sourceDocs && (
                        <div
                          className="p-5"
                          key={`sourceDocsAccordion-${index}`}
                        >
                          <Accordion
                            type="single"
                            collapsible
                            className="flex-col"
                          >
                            {message.sourceDocs.map((doc, index) => (
                              <div key={`messageSourceDocs-${index}`}>
                                <AccordionItem value={`item-${index}`}>
                                  <AccordionTrigger>
                                    <h3>Source {index + 1}</h3>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ReactMarkdown linkTarget="_blank">
                                      {doc.pageContent}
                                    </ReactMarkdown>
                                    <p className="mt-2">
                                      <b>Source:
                                      </b> {doc.metadata.source}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                              </div>
                            ))}
                          </Accordion>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div className={styles.center}>
              <div className={styles.cloudform}>
                <form onSubmit={handleSubmit}>
                  <div className={styles.textareaWrapper}>
                    <textarea
                      disabled={loading}
                      onKeyDown={handleEnter}
                      ref={textAreaRef}
                      autoFocus={false}
                      rows={1}
                      maxLength={512}
                      id="userInput"
                      name="userInput"
                      placeholder={
                        loading
                          ? 'Đang tìm kiếm thông tin...'
                          : 'Bạn đang thắc mắc về vấn đề nào?'
                      }
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={styles.textarea}
                    />
                    {/* <span className={styles.microIcon}>
                      <FaMicrophone />
                    </span> */}

                    <span className={styles.microIcon} onClick={handleListen}>
                      {isListen ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.generatebutton}
                  >
                    {loading ? (
                      <div className={styles.loadingwheel}>
                        <LoadingDots color="#000" />
                      </div>
                    ) : (
                      // Send icon SVG in input field
                      <svg
                        viewBox="0 0 20 20"
                        className={styles.svgicon}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
            {error && (
              <div className="border border-red-400 rounded-md p-4">
                <p className="text-red-500">Xin vui lòng tải lại trang và thử lại!</p>
              </div>
            )}
          </main>
        </div>
        <footer className={styles.footer}>
          <a>
            <Image
              src="/logoBK.png"
              alt="Smart Shark"
              width={50}
              height={50}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            Bản quyền thuộc Trường Đại học Bách Khoa - ĐHQG-HCM
          </a>
        </footer>
      </Layout>
    </>
  );
}
