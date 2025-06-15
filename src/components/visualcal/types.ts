
export type CalendarStyle = 'modern' | 'classic' | 'minimal';
export type BorderStyle = 'solid' | 'rounded' | 'none';
export type BorderWidth = 'thin' | 'medium' | 'thick'; // 1px, 2px, 3px
export type DayHeaderStyle = 'simple' | 'bordered' | 'pill';
export type NotesPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'under-image';
export type QuotesPosition = 'header' | 'above-image' | 'below-image' | 'below-notes-module' | 'page-bottom';
export type DisplayLayout = 'default' | 'image-30-calendar-70' | 'landscape-banner';
export type SupportedFont =
  "Roboto" | "Open Sans" | "Montserrat" | "Lato" | "Poppins" |
  "Arial" | "Verdana" | "Georgia" | "Times New Roman" | "Courier New" |
  "Noto Sans" | "Source Sans Pro" | "Raleway" | "Oswald" | "Merriweather" | "Playfair Display";
export type PaperOrientation = 'portrait' | 'landscape';
export type AppTheme =
  'default' |
  'oceanic' |
  'forest-canopy' |
  'sunset-glow' |
  'arctic-dawn' |
  'desert-mirage' |
  'vintage-paper' |
  'cyberpunk-neon' |
  'coral-reef' |
  'monochrome-classic' |
  'earthy-tones' |
  'lavender-fields' |
  'cosmic-dark' |
  'spring-bloom' |
  'autumn-leaves' |
  'minimalist-white' |
  'minimalist-dark' |
  'tropical-paradise' |
  'royal-velvet' |
  'industrial-chic' |
  'candy-pop' |
  'zen-garden';

export type DayNumberFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type MonthYearHeaderAlignment = 'left' | 'center' | 'right';

// New Types for Customization
export type FontSizeOption = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextTransformOption = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type WeekdayHeaderLength = 'short' | 'long'; // "Mon" vs "Monday"
export type MonthYearDisplayOrder = 'month-year' | 'year-month';
export type DayCellPaddingOption = 'xs' | 'sm' | 'base' | 'lg';
export type DayNumberAlignment =
  'top-left' | 'top-center' | 'top-right' |
  'center-left' | 'center' | 'center-right' |
  'bottom-left' | 'bottom-center' | 'bottom-right';


export interface CalendarConfig {
  selectedMonth: number; // 0-11
  selectedYear: number;

  showImage: boolean; // New: Toggle for image visibility
  imageSrc: string | null;
  imagePosition: { x: number; y: number }; // percentages for transform translate
  imageSize: number; // percentage for transform scale
  imagePanelDimension: number; // General dimension (20-50), interpreted by layout

  showNotes: boolean;
  notesContent: string;
  notesPosition: NotesPosition;
  notesSize: { width: number; height: number }; // pixels or percentage for absolutely positioned notes

  showQuotes: boolean;
  quotesContent: string;
  quotesPosition: QuotesPosition;

  headerFont: SupportedFont;
  bodyFont: SupportedFont;
  calendarStyle: CalendarStyle;
  borderStyle: BorderStyle;
  borderWidth: BorderWidth;
  dayHeaderStyle: DayHeaderStyle;
  showWeekends: boolean;
  startWeekOnMonday: boolean;
  resizeRowsToFill: boolean;
  displayLayout: DisplayLayout;
  paperOrientation: PaperOrientation;
  theme: AppTheme;
  dayNumberFontSize: DayNumberFontSize;
  monthYearHeaderAlignment: MonthYearHeaderAlignment;

  // New Customization Options
  monthYearHeaderFontSize: FontSizeOption;
  monthYearDisplayOrder: MonthYearDisplayOrder;
  showMonthName: boolean;
  showYear: boolean;
  monthYearHeaderFullWidth: boolean;
  weekdayHeaderFontSize: FontSizeOption;
  weekdayHeaderTextTransform: TextTransformOption;
  weekdayHeaderLength: WeekdayHeaderLength;
  dayCellPadding: DayCellPaddingOption;
  showWeekNumbers: boolean;
  weekNumberFontSize: FontSizeOption;
  dayNumberAlignment: DayNumberAlignment;
}

export const FONT_OPTIONS: SupportedFont[] = [
  "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins",
  "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New",
  "Noto Sans", "Source Sans Pro", "Raleway", "Oswald", "Merriweather", "Playfair Display"
];
export const CALENDAR_STYLE_OPTIONS: CalendarStyle[] = ['modern', 'classic', 'minimal'];
export const BORDER_STYLE_OPTIONS: BorderStyle[] = ['solid', 'rounded', 'none'];
export const BORDER_WIDTH_OPTIONS: { label: string, value: BorderWidth }[] = [
  { label: 'Thin (1px)', value: 'thin' },
  { label: 'Medium (2px)', value: 'medium' },
  { label: 'Thick (3px)', value: 'thick' },
];
export const DAY_HEADER_STYLE_OPTIONS: DayHeaderStyle[] = ['simple', 'bordered', 'pill'];
export const NOTES_POSITION_OPTIONS: NotesPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'under-image'];
export const QUOTES_POSITION_OPTIONS: {label: string, value: QuotesPosition}[] = [
  {label: 'In Calendar Header', value: 'header'},
  {label: 'Above Image', value: 'above-image'},
  {label: 'Below Image', value: 'below-image'},
  {label: 'Below Notes Area', value: 'below-notes-module'},
  {label: 'Bottom of Page (Full Width)', value: 'page-bottom'}
];
export const PAPER_ORIENTATION_OPTIONS: PaperOrientation[] = ['portrait', 'landscape'];
export const THEME_OPTIONS: { label: string, value: AppTheme }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Oceanic', value: 'oceanic' },
  { label: 'Forest Canopy', value: 'forest-canopy' },
  { label: 'Sunset Glow', value: 'sunset-glow' },
  { label: 'Arctic Dawn', value: 'arctic-dawn' },
  { label: 'Desert Mirage', value: 'desert-mirage' },
  { label: 'Vintage Paper', value: 'vintage-paper' },
  { label: 'Cyberpunk Neon', value: 'cyberpunk-neon' },
  { label: 'Coral Reef', value: 'coral-reef' },
  { label: 'Monochrome Classic', value: 'monochrome-classic' },
  { label: 'Earthy Tones', value: 'earthy-tones' },
  { label: 'Lavender Fields', value: 'lavender-fields' },
  { label: 'Cosmic Dark', value: 'cosmic-dark' },
  { label: 'Spring Bloom', value: 'spring-bloom' },
  { label: 'Autumn Leaves', value: 'autumn-leaves' },
  { label: 'Minimalist White', value: 'minimalist-white' },
  { label: 'Minimalist Dark', value: 'minimalist-dark' },
  { label: 'Tropical Paradise', value: 'tropical-paradise' },
  { label: 'Royal Velvet', value: 'royal-velvet' },
  { label: 'Industrial Chic', value: 'industrial-chic' },
  { label: 'Candy Pop', value: 'candy-pop' },
  { label: 'Zen Garden', value: 'zen-garden' },
];
export const DAY_NUMBER_FONT_SIZE_OPTIONS: {label: string, value: DayNumberFontSize}[] = [
    {label: 'Extra Small', value: 'xs'},
    {label: 'Small', value: 'sm'},
    {label: 'Base', value: 'base'},
    {label: 'Large', value: 'lg'},
    {label: 'Extra Large', value: 'xl'}
];
export const MONTH_YEAR_HEADER_ALIGNMENT_OPTIONS: {label: string, value: MonthYearHeaderAlignment}[] = [
    {label: 'Left', value: 'left'},
    {label: 'Center', value: 'center'},
    {label: 'Right', value: 'right'}
];


export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// New Consts for Customization Options
export const FONT_SIZE_OPTIONS: { label: string, value: FontSizeOption }[] = [
  { label: 'XS', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
  { label: 'XL', value: 'xl' },
  { label: '2XL', value: '2xl' },
  { label: '3XL', value: '3xl' },
];

export const TEXT_TRANSFORM_OPTIONS: { label: string, value: TextTransformOption }[] = [
  { label: 'None', value: 'none' },
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Capitalize', value: 'capitalize' },
];

export const WEEKDAY_HEADER_LENGTH_OPTIONS: { label: string, value: WeekdayHeaderLength }[] = [
  { label: 'Short (Mon)', value: 'short' },
  { label: 'Long (Monday)', value: 'long' },
];

export const MONTH_YEAR_DISPLAY_ORDER_OPTIONS: { label: string, value: MonthYearDisplayOrder }[] = [
  { label: 'Month Year (January 2024)', value: 'month-year' },
  { label: 'Year Month (2024 January)', value: 'year-month' },
];

export const DAY_CELL_PADDING_OPTIONS: { label: string, value: DayCellPaddingOption }[] = [
  { label: 'Extra Small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Base', value: 'base' },
  { label: 'Large', value: 'lg' },
];

export const WEEK_NUMBER_FONT_SIZE_OPTIONS: { label: string, value: FontSizeOption }[] = [
    { label: 'Extra Small', value: 'xs' },
    { label: 'Small', value: 'sm' },
    { label: 'Base', value: 'base' },
    { label: 'Large', value: 'lg' },
];

export const DAY_NUMBER_ALIGNMENT_OPTIONS: {label: string, value: DayNumberAlignment}[] = [
  {label: 'Top Left', value: 'top-left'},
  {label: 'Top Center', value: 'top-center'},
  {label: 'Top Right', value: 'top-right'},
  {label: 'Center Left', value: 'center-left'},
  {label: 'Center', value: 'center'},
  {label: 'Center Right', value: 'center-right'},
  {label: 'Bottom Left', value: 'bottom-left'},
  {label: 'Bottom Center', value: 'bottom-center'},
  {label: 'Bottom Right', value: 'bottom-right'},
];

