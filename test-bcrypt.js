import bcrypt from "bcryptjs";

const run = async () => {
  const plainPassword = "o0vqj6tq";
  const hashedPassword = "$2b$10$R22ZGVUfSilUBkIy3hCtVujX2GKKjOv8fsPnyU6gYC1J9KY60ioGO";

  const match = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Password match:", match);
};

run();
