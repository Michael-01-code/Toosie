export const serverBaseUrl = 'https://toosie.herokuapp.com/api/v1';
// export const serverBaseUrl = 'http://localhost:3000/api/v1';

export const baseEndpoints = {
    auth: serverBaseUrl + '/auth',
    user: serverBaseUrl + '/users',
    referrals: serverBaseUrl + '/users/referrals',
    searchProduct: serverBaseUrl + '/searchProduct',
    inventory: serverBaseUrl + '/product',
    category: serverBaseUrl + '/category',
    prescription: serverBaseUrl + '/prescription',
    order: serverBaseUrl + '/order',
    notify: serverBaseUrl + '/notify',
    blog: serverBaseUrl + '/blog',
    banner: serverBaseUrl + '/banner',


  };
export const authEndpoints = {
    login: baseEndpoints.auth + '/login',
    signup: baseEndpoints.auth + '/signup',
    
    activate: baseEndpoints.auth + '/register/activate',
    forgotPasswordInitiate: baseEndpoints.auth + '/forgot-password/initiate',
    forgotPasswordComplete: baseEndpoints.auth + '/forgot-password/complete',
    changePassword: baseEndpoints.auth + '/change-password',
    addAddress: baseEndpoints.auth + '/add/address',
    deleteAddress: baseEndpoints.auth + '/address/remove',
    allAddress: baseEndpoints.auth + '/address/all',
    updateProfile: baseEndpoints.auth + '/update/profile',
    updateProfileImage: baseEndpoints.auth + '/update/profile/image',
};
export const blogEndpoints = {
    blogListing: serverBaseUrl + '/blog/',
    singlePost: serverBaseUrl + '/blog/',
};

export const roleEndpoints = {
    getRoles: baseEndpoints.auth + '/role/all',
    addRole: baseEndpoints.auth + '/add/role',
    asssignRole: baseEndpoints.auth + '/role/asign',
    removeUserRole: baseEndpoints.auth + '/users/role/remove',
    updateProfileImage: baseEndpoints.auth + '/update/profile/image',
};
export const prescriptionEndpoints = {
    newPrecription: baseEndpoints.auth + '/prescription/new',
    usersPrescription: baseEndpoints.auth + '/prescription/mine/all'
};
export const refillEndpoints = {
    addRefill: baseEndpoints.auth + '/refill/new',
    removeRefill: baseEndpoints.auth + '/refill/close',
    allRefill: baseEndpoints.auth + '/refill/mine/'
};

export const wishListEndpoints = {
    addWish: baseEndpoints.auth + '/wishlist/new',
    removeWish: baseEndpoints.auth + '/wishlist/remove',
    allWish: baseEndpoints.auth + '/wishlist/mine/all'
};
export const miscEndpoint = {
    mediaUpload: baseEndpoints.inventory + '/uploadMedia',
};
export const categoryEndpoint = {
    mediaUpload: baseEndpoints.inventory + '/uploadMedia',
};
export const inventoryEndpoints = {
    createInventory: baseEndpoints.inventory + '/product/new',
    getProduct: baseEndpoints.inventory + '/',
    createCategory: baseEndpoints.inventory + '/category/new',
    createBrand: baseEndpoints.inventory + '/brand/new',
    createTags: baseEndpoints.inventory + '/tags/new',
    allCategories: baseEndpoints.inventory + '/category',
    allTags: baseEndpoints.inventory + '/tags/all',
    brands: baseEndpoints.inventory + '/brands/all',
    inventoryByCategory: baseEndpoints.inventory + '/product/all/',
    searchInventory: baseEndpoints.inventory + '/product/search',
    popular: baseEndpoints.inventory,
    latest: baseEndpoints.inventory,
    savePODOrder: baseEndpoints.inventory + '/order/save',
    saveCardOrder: baseEndpoints.inventory + '/order/card/save',
    saveTokenOrder: baseEndpoints.inventory + '/order/token/card/save',
    myOrders: baseEndpoints.inventory + '/order/mine/',
    single: baseEndpoints.inventory + '/product/open/',
};
