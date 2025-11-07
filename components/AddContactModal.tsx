import React, { useState, useRef, useEffect } from 'react';
import { Contact, Relationship } from '../types';
import { extractContactFromImage } from '../services/geminiService';
import XMarkIcon from './icons/XMarkIcon';
import CameraIcon from './icons/CameraIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';

interface AddContactModalProps {
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onAddContact }) => {
  const [step, setStep] = useState<'camera' | 'parsing' | 'form' | 'error'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({
    relationship: Relationship.Business,
    interests: [],
    importantDates: {},
  });
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const setupCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("카메라 접근 오류:", err);
      setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      setStep('error');
    }
  };

  useEffect(() => {
    setupCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
      setCapturedImage(imageData);
      setStep('parsing');

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  useEffect(() => {
    const parseImage = async () => {
      if (step === 'parsing' && capturedImage) {
        try {
          const extractedData = await extractContactFromImage(capturedImage);
          setFormData(prev => ({ ...prev, ...extractedData }));
          setStep('form');
        } catch (err) {
          console.error(err);
          setError('명함 정보 추출에 실패했습니다. 다시 시도해주세요.');
          setStep('error');
        }
      }
    };
    parseImage();
  }, [step, capturedImage]);

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
    setFormData({ relationship: Relationship.Business, interests: [], importantDates: {} });
    setupCamera();
    setStep('camera');
  };

  const handleChange = (field: keyof Omit<Contact, 'id' | 'interests' | 'importantDates'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.affiliation) {
        alert("이름과 소속은 필수 항목입니다.");
        return;
    }
    onAddContact(formData as Omit<Contact, 'id'>);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col m-4 border border-gray-700">
        <div className="p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold">새 연락처 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
            {step === 'camera' && (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-300 text-center">명함을 화면에 맞춰주세요.</p>
                    <div className="w-full bg-black rounded-lg overflow-hidden aspect-[16/10]">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <button onClick={handleCapture} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <CameraIcon className="w-5 h-5" />
                        촬영하기
                    </button>
                </div>
            )}
            {step === 'parsing' && (
                <div className="text-center py-20">
                    <svg className="animate-spin mx-auto h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-300">명함 정보를 분석 중입니다...</p>
                </div>
            )}
            {step === 'error' && (
                <div className="text-center py-20">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={handleRetake} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        다시 시도하기
                    </button>
                </div>
            )}
            {step === 'form' && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">추출된 정보 확인</h3>
                    {capturedImage && <img src={`data:image/jpeg;base64,${capturedImage}`} alt="Captured business card" className="rounded-lg w-full" />}
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm text-gray-400">이름</label>
                            <input type="text" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">소속</label>
                            <input type="text" value={formData.affiliation || ''} onChange={e => handleChange('affiliation', e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">관계</label>
                            <select value={formData.relationship || Relationship.Business} onChange={e => handleChange('relationship', e.target.value)} className="w-full bg-gray-700 p-2 rounded mt-1">
                                <option value={Relationship.Business}>비즈니스</option>
                                <option value={Relationship.Friend}>친구</option>
                                <option value={Relationship.Family}>가족</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">관심사 (쉼표로 구분)</label>
                            <input type="text" value={formData.interests?.join(', ') || ''} onChange={handleInterestsChange} className="w-full bg-gray-700 p-2 rounded mt-1" />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                        <button onClick={handleRetake} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                           <ArrowPathIcon className="w-5 h-5" /> 다시 찍기
                        </button>
                        <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                            저장하기
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;