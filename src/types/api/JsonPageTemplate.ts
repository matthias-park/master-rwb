interface JsonPageTemplate {
  meta_description: string;
  meta_title: string;
  name: string;
  slug: string;
  structure: {
    content: {
      standart: {
        page_title: {
          id: number;
          value: string;
        };
      };
      section: {
        menu_item: {
          id: number;
          value: string;
        };
        section_content: {
          id: number;
          value: string;
        };
        section_title: {
          id: number;
          value: string;
        };
        section_image_url: {
          id: number;
          value: string;
        };
      };
    }[];
  };
}

export default JsonPageTemplate;
