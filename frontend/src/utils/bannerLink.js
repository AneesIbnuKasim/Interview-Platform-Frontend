export const getBannerLink = (banner) => {
  switch (banner.linkType) {
    case "category":
      const linkValue =
        banner.linkValue.charAt(0).toUpperCase() + banner.linkValue.slice(1);
      return `/products/${linkValue}`;

    case "product":
      return `/product/${banner.linkValue}`;

    case "filter":
      return `/products/${banner.linkValue}`;

    
  }
};
