
export const EVENT_CATEGORIES = [
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

export function createEventDocument(data, user) {
  return {
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    image: data.image.trim(),
    location: data.location.trim(),
    date: data.date,

    creatorEmail: user.email,
    creatorName: user.name || "Community Member",

    volunteers: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function isValidEvent(data) {
  return (
    typeof data.title === "string" &&
    data.title.trim().length > 0 &&
    typeof data.description === "string" &&
    data.description.trim().length > 0 &&
    EVENT_CATEGORIES.includes(data.category) &&
    typeof data.image === "string" &&
    data.image.trim().length > 0 &&
    typeof data.location === "string" &&
    data.location.trim().length > 0 &&
    typeof data.date === "string" &&
    !Number.isNaN(Date.parse(data.date))
  );
}
