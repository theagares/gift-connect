import React, { useState, useMemo } from 'react';
import { Contact, Relationship } from './types';
import { MOCK_CONTACTS } from './constants';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactDetailModal from './components/ContactDetailModal';
import AddContactModal from './components/AddContactModal';
import PlusIcon from './components/icons/PlusIcon';

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('all');

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetailModal = () => {
    setSelectedContact(null);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prevContacts =>
      prevContacts.map(c => (c.id === updatedContact.id ? updatedContact : c))
    );
    setSelectedContact(updatedContact);
  };

  const handleAddNewContact = (newContactData: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...newContactData,
      id: Date.now().toString(),
      giftHistory: [],
      lastContactDate: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [newContact, ...prev]);
    setIsAddModalOpen(false);
  };
  
  const isUpcomingEvent = (dateStr?: string): boolean => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    eventDate.setFullYear(today.getFullYear()); // Compare with this year's date
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const filteredContacts = useMemo(() => {
    if (filter === 'all') return contacts;
    if (filter === Relationship.Business || filter === Relationship.Friend || filter === Relationship.Family) {
      return contacts.filter(c => c.relationship === filter);
    }
    if (filter === 'upcomingEvents') {
      return contacts.filter(c => 
        isUpcomingEvent(c.importantDates.birthday) ||
        isUpcomingEvent(c.importantDates.promotionDate) ||
        isUpcomingEvent(c.importantDates.weddingAnniversary)
      );
    }
    return contacts;
  }, [contacts, filter]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-200">명함집</h2>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow-lg transition-transform transform hover:scale-110"
                aria-label="새 연락처 추가"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg">
            <FilterButton label="전체" value="all" activeFilter={filter} setFilter={setFilter} />
            <FilterButton label="비즈니스" value={Relationship.Business} activeFilter={filter} setFilter={setFilter} />
            <FilterButton label="친구" value={Relationship.Friend} activeFilter={filter} setFilter={setFilter} />
            <FilterButton label="기념일 임박" value="upcomingEvents" activeFilter={filter} setFilter={setFilter} />
          </div>
        </div>
        <ContactList contacts={filteredContacts} onSelectContact={handleSelectContact} />
      </main>
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={handleCloseDetailModal}
          onUpdate={handleUpdateContact}
        />
      )}
      {isAddModalOpen && (
        <AddContactModal 
            onClose={() => setIsAddModalOpen(false)}
            onAddContact={handleAddNewContact}
        />
      )}
    </div>
  );
};

interface FilterButtonProps {
    label: string;
    value: string;
    activeFilter: string;
    setFilter: (value: string) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, value, activeFilter, setFilter }) => {
    const isActive = activeFilter === value;
    return (
        <button
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );
};


export default App;