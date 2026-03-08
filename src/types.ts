export interface Tour {
  id: number;
  title: string;
  location: string;
  price: number;
  duration: string;
  description: string;
  image_url: string;
  rating: number;
  category: string;
}

export interface Booking {
  id?: number;
  tour_id: number;
  customer_name: string;
  customer_email: string;
  booking_date?: string;
  status?: string;
}

export interface Destination {
  id: number;
  slug: string;
  name: string;
  hero_image: string;
  video_url: string;
  description: string;
  highlights: string[];
  attractions: { name: string; desc: string }[];
}
