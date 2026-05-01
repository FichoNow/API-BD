export interface SuperadminListItem {
  id:        number;
  name:      string;
  email:     string;
  is_active: boolean;
}

export type GetSuperadminsResponse = SuperadminListItem[];
