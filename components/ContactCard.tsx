import React from 'react';
import { Contact, Relationship } from '../types';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import CakeIcon from './icons/CakeIcon';

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onSelect }) => {
  const getRelationshipStyles = (relationship: Relationship) => {
    switch (relationship) {
      case Relationship.Business:
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case Relationship.Friend:
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case Relationship.Family:
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const isBirthdaySoon = () => {
    if (!contact.importantDates.birthday) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthday = new Date(contact.importantDates.birthday);
    birthday.setFullYear(today.getFullYear());
    const diffTime = birthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div
      onClick={() => onSelect(contact)}
      className="bg-gray-800 rounded-xl shadow-lg p-5 cursor-pointer transition-shadow duration-300 hover:shadow-indigo-500/30 border border-gray-700/50 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRelationshipStyles(
              contact.relationship
            )}`}
          >
            {contact.relationship}
          </span>
          {isBirthdaySoon() && (
            <div className="flex items-center text-yellow-400 animate-pulse" title="곧 생일!">
              <CakeIcon className="w-5 h-5" />
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-100">{contact.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{contact.affiliation}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4 text-xs text-gray-500 flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <UserGroupIcon className="w-4 h-4" />
            <span>주요 관심사: {contact.interests[0]} 등</span>
         </div>
         <div className="flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4" />
            <span>마지막 연락: {contact.lastContactDate}</span>
         </div>
      </div>
    </div>
  );
};

export default ContactCard;