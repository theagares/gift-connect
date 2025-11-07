import React from 'react';
import { Contact } from '../types';
import ContactCard from './ContactCard';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onSelectContact }) => {
  if (contacts.length === 0) {
    return (
        <div className="text-center py-20 bg-gray-800 rounded-lg">
            <p className="text-gray-400">해당 필터에 맞는 연락처가 없습니다.</p>
        </div>
    );
  }

  return (
    <div className="py-4">
      <style>{`
        .desktop-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Container for the list. On mobile it's a simple vertical list. On desktop, it gets horizontal scroll. */}
      <div 
        className="md:overflow-x-auto md:py-2 md:-mx-4 desktop-scrollbar" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        {/* Flex container for cards. Switches from column to row. */}
        <div className="
          flex flex-col items-center w-full space-y-4
          md:flex-row md:items-start md:space-y-0 md:px-4 md:space-x-[-180px] md:min-h-[240px]
        "> 
            {contacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="
                  w-full max-w-md 
                  md:w-80 md:h-56 md:flex-shrink-0 
                  transition-all duration-300 ease-in-out md:origin-bottom 
                  md:hover:transform md:hover:scale-[1.03] md:hover:-translate-y-3 md:hover:z-20"
                style={{ zIndex: index }}
              >
                <ContactCard contact={contact} onSelect={onSelectContact} />
              </div>
            ))}
            
            {/* Spacer only for desktop view */}
            <div className="hidden md:block flex-shrink-0 w-56"></div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
