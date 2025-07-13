export const getUserData = (user) => {
  return  {
    _id: user.id,
    email: user.email,
    profileSetup: user.profileSetup,
    firstName: user.firstName,
    image: user.image,
    color: user.color,
  }
}
