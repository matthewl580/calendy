export type CalendarStyle = 'modern' | 'classic' | 'minimal';
export type BorderStyle = 'solid' | 'rounded' | 'none';
export type BorderWidth = 'thin' | 'medium' | 'thick'; // 1px, 2px, 3px
export type DayHeaderStyle = 'simple' | 'bordered' | 'pill';
export type NotesPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'under-image';
export type DisplayLayout = 'default' | 'image-30-calendar-70';
export type SupportedFont = "Roboto" | "Open Sans" | "Montserrat" | "Lato" | "Poppins";

export interface CalendarConfig {
  selectedMonth: number; // 0-11
  selectedYear: number;
  imageSrc: string | null;
  imagePosition: { x: number; y: number }; // percentages for transform translate
  imageSize: number; // percentage for transform scale
  notesContent: string;
  notesPosition: NotesPosition;
  notesSize: { width: number; height: number }; // pixels or percentage for absolutely positioned notes
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
}

export const FONT_OPTIONS: SupportedFont[] = ["Roboto", "Open Sans", "Montserrat", "Lato", "Poppins"];
export const CALENDAR_STYLE_OPTIONS: CalendarStyle[] = ['modern', 'classic', 'minimal'];
export const BORDER_STYLE_OPTIONS: BorderStyle[] = ['solid', 'rounded', 'none'];
export const BORDER_WIDTH_OPTIONS: { label: string, value: BorderWidth }[] = [
  { label: 'Thin (1px)', value: 'thin' },
  { label: 'Medium (2px)', value: 'medium' },
  { label: 'Thick (3px)', value: 'thick' },
];
export const DAY_HEADER_STYLE_OPTIONS: DayHeaderStyle[] = ['simple', 'bordered', 'pill'];
export const NOTES_POSITION_OPTIONS: NotesPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'under-image'];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];
