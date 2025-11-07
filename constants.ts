
import { Contact, Relationship } from './types';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: '김철수',
    affiliation: '알파테크',
    relationship: Relationship.Business,
    interests: ['골프', '위스키', '최신 IT 기기'],
    allergies: ['갑각류'],
    importantDates: {
      birthday: '1985-07-15',
      promotionDate: '2023-03-01',
    },
    giftHistory: [{ date: '2023-03-01', gift: '고급 만년필' }],
    lastContactDate: '2024-05-10',
  },
  {
    id: '2',
    name: '박영희',
    affiliation: '프리랜서 디자이너',
    relationship: Relationship.Friend,
    interests: ['핸드드립 커피', '인디 음악 감상', '고양이', '식물 키우기'],
    importantDates: {
      birthday: '1990-11-22',
    },
    giftHistory: [{ date: '2023-11-22', gift: '희귀 원두 세트' }],
    lastContactDate: '2024-06-01',
  },
  {
    id: '3',
    name: '이민준',
    affiliation: '베타솔루션즈',
    relationship: Relationship.Business,
    interests: ['등산', '사진 촬영', '와인'],
    importantDates: {
      birthday: '1978-02-10',
      weddingAnniversary: '2010-05-20',
    },
    giftHistory: [],
    lastContactDate: '2024-04-20',
  },
  {
    id: '4',
    name: '최지우',
    affiliation: '대학 동기',
    relationship: Relationship.Friend,
    interests: ['요가', '비건 베이킹', '여행'],
    allergies: ['유제품'],
    importantDates: {
      birthday: '1992-09-05',
    },
    giftHistory: [{ date: '2023-09-05', gift: '친환경 요가 매트' }],
    lastContactDate: '2024-05-25',
  },
];
