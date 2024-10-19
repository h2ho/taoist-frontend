export type InventoryUserResponse = {
  id: string;
  user: string | null; // User could be null if the inventory is not borrowed
  date: string | null; // Loan date, could be null if not borrowed
};

export type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  inventoryUserResponseList: InventoryUserResponse[];
};