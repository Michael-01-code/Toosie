export interface IProducts {
    tags:            string[];
    resourceImages:  string[];
    _id:             string;
    category:        string;
    title:           string;
    description:     string;
    ingredients:     string;
    warning:         string;
    enabled:         boolean;
    isSpecial:       boolean;
    isTrending:      boolean;
    stock:           number;
    actualPrice:     string;
    discountPercent: string;
    brand:           string;
    createdAt:       Date;
    updatedAt:       Date;
    __v:             number;
}
