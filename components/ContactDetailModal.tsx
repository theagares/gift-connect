
import React, { useState } from 'react';
import { Contact } from '../types';
import GiftRecommender from './GiftRecommender';
import XMarkIcon from './icons/XMarkIcon';
import CakeIcon from './icons/CakeIcon';

interface ContactDetailModalProps {
  contact: Contact;
  onClose: () => void;
  onUpdate: (contact: Contact) => void;
}

const ContactDetailModal: React.FC<ContactDetailModalProps> = ({ contact, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContact, setEditableContact] = useState(contact);

  const handleInputChange = <K extends keyof Contact>(field: K, value: Contact[K]) => {
    setEditableContact(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableContact(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()) }));
  };

  const handleDateChange = (field: 'birthday' | 'promotionDate' | 'weddingAnniversary', value: string) => {
    setEditableContact(prev => ({
        ...prev,
        importantDates: {
            ...prev.importantDates,
            [field]: value
        }
    }));
  };

  const handleSave = () => {
    onUpdate(editableContact);
    setIsEditing(false);
  };
  
  const formatDate = (dateStr?: string) => {
    if(!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('ko-KR');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 border border-gray-700">
        <div className="sticky top-0 bg-gray-800/80 backdrop-blur-sm p-6 flex justify-between items-center border-b border-gray-700 z-10">
          <div>
            <h2 className="text-2xl font-bold">{contact.name}</h2>
            <p className="text-gray-400">{contact.affiliation}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column: Profile */}
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">프로필</h3>
                {isEditing ? (
                    <div className="space-y-3">
                        <input type="text" value={editableContact.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                        <input type="text" value={editableContact.affiliation} onChange={e => handleInputChange('affiliation', e.target.value)} className="w-full bg-gray-700 p-2 rounded" />
                        <input type="text" value={editableContact.interests.join(', ')} onChange={handleInterestsChange} className="w-full bg-gray-700 p-2 rounded" placeholder="관심사 (쉼표로 구분)"/>
                        <input type="text" value={editableContact.importantDates.birthday} onChange={e => handleDateChange('birthday', e.target.value)} className="w-full bg-gray-700 p-2 rounded" placeholder="생일 (YYYY-MM-DD)"/>
                    </div>
                ) : (
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li><span className="font-semibold text-gray-500 w-24 inline-block">관계:</span> {contact.relationship}</li>
                        <li><span className="font-semibold text-gray-500 w-24 inline-block">관심사:</span> {contact.interests.join(', ')}</li>
                        <li><span className="font-semibold text-gray-500 w-24 inline-block">알러지:</span> {contact.allergies?.join(', ') || '없음'}</li>
                        <li><span className="font-semibold text-gray-500 w-24 inline-block">마지막 연락:</span> {formatDate(contact.lastContactDate)}</li>
                    </ul>
                )}
            </div>

            {/* Right Column: Dates & History */}
            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg">
                 <h3 className="font-semibold text-lg border-b border-gray-700 pb-2 mb-3">중요 일정 및 기록</h3>
                 <div className="space-y-2 text-sm">
                    {contact.importantDates.birthday && <p className="flex items-center gap-2"><CakeIcon className="w-4 h-4 text-pink-400"/> 생일: {formatDate(contact.importantDates.birthday)}</p>}
                    {contact.importantDates.promotionDate && <p>승진일: {formatDate(contact.importantDates.promotionDate)}</p>}
                    {contact.importantDates.weddingAnniversary && <p>결혼기념일: {formatDate(contact.importantDates.weddingAnniversary)}</p>}
                 </div>
                 <h4 className="font-semibold pt-2">과거 선물 기록</h4>
                 <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                    {contact.giftHistory.length > 0 ? contact.giftHistory.map((h, i) => <li key={i}>{h.gift} ({formatDate(h.date)})</li>) : <li>기록 없음</li>}
                 </ul>
            </div>
          </div>
          <div className="flex justify-end mb-6">
              {isEditing ? (
                  <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">저장</button>
              ) : (
                  <button onClick={() => setIsEditing(true)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">프로필 수정</button>
              )}
          </div>
          
          {/* AI Recommender */}
          <GiftRecommender contact={contact} />
        </div>
      </div>
    </div>
  );
};

export default ContactDetailModal;
