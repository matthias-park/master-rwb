interface ContentPage {
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  structure: Structure;
}

export default ContentPage;

export interface Structure {
  content: Content[];
}

export interface Content {
  standart?: Standart;
  section?: Section;
}

export interface Section {
  menu_item?: DropdownButtonTranslations;
  section_title: DropdownButtonTranslations;
  section_content: DropdownButtonTranslations;
  section_image_url?: DropdownButtonTranslations;
  dropdown_button_translations?: DropdownButtonTranslations;
}

export interface DropdownButtonTranslations {
  value: string;
}

export interface Standart {
  page_title: DropdownButtonTranslations;
  dropdown_button_translations: DropdownButtonTranslations;
}
