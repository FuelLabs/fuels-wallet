export const getProjectImage = (image: string) => {
  const hasExtension = /\.(jpeg|jpg|png|svg|webp|gif)$/i.test(image);
  const imageFileName = hasExtension ? image : `${image}.jpeg`;

  return `https://raw.githubusercontent.com/FuelLabs/fuel-ecosystem/refs/heads/main/assets/${imageFileName}`;
};
