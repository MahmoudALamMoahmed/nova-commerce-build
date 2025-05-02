
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Leather Sofa",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    description: "This elegant leather sofa combines comfort with modern design. Perfect for any living room, its durable construction and premium materials ensure years of relaxation and style."
  },
  {
    id: "2",
    name: "Wooden Dining Table",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    description: "Handcrafted from sustainable oak, this dining table comfortably seats six people. Its timeless design and sturdy construction make it the perfect centerpiece for family gatherings."
  },
  {
    id: "3",
    name: "Minimalist Desk Lamp",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    description: "This adjustable desk lamp features clean lines and energy-efficient LED lighting. Perfect for your home office or bedside table, it provides focused illumination with minimal energy consumption."
  },
  {
    id: "4",
    name: "Decorative Throw Pillows",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1584557053493-21739094f5a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=770&q=80",
    description: "Add a splash of color and comfort to any room with these premium decorative throw pillows. Made with high-quality fabric and plush filling, they're both stylish and comfortable."
  },
  {
    id: "5",
    name: "Ceramic Vase Set",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1602020278060-22ac4cca9cd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    description: "This set of three ceramic vases features unique glazes and organic shapes. Perfect for displaying fresh flowers or as standalone decorative pieces, they add texture and interest to any surface."
  },
  {
    id: "6",
    name: "Modern Wall Clock",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=770&q=80",
    description: "This sleek wall clock combines functionality with modern design. Its silent movement ensures peace and quiet, while its minimalist face makes reading the time effortless."
  }
];
