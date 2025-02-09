export type IRSSData = {
  title: string;
  description?: string;
  link?: string;
  item?: IRSSDataItem[];
  allowEmpty?: boolean;
  image?: string;
  author?: string;
  language?: string;
  feedLink?: string;
  lastBuildDate?: string;
  itunes_author?: string;
  itunes_category?: string;
  itunes_explicit?: string | boolean;
  id?: string;

  atomlink?: string;
  ttl?: number;
};

// rss
export type IRSSDataItem = {
  title: string;
  description?: any;
  pubDate?: number | string | Date;
  link?: string;
  category?: string[];
  author?:
      | string
      | {
            name: string;
            url?: string;
            avatar?: string;
        }[];
  doi?: string;
  guid?: string;
  id?: string;
  content?: {
      html: string;
      text: string;
  };
  image?: string;
  banner?: string;
  updated?: number | string | Date;
  language?: string;
  enclosure_url?: string;
  enclosure_type?: string;
  enclosure_title?: string;
  enclosure_length?: number;
  itunes_duration?: number | string;
  itunes_item_image?: string;
  media?: Record<string, Record<string, string>>;

  _extra?: Record<string, any> & {
      links?: {
          url: string;
          type: string;
          content_html?: string;
      }[];
  };
};

export type IBindings = {
  GITHUB_TOKEN: string
}
