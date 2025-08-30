export interface Photo {
  name: string;
  src: string;
  filter: string;
}

export interface FilterOption {
  label: string;
  value: string;
  className: string;
}

export interface GalleryProps {
  photos: Photo[];
  activeFilter: string;
}

export interface FilterProps {
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}