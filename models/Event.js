
export const EVENT_CATEGORIES = [
  "Donation",
  "Social Work",
  "Cleanup",
  "Plantation",
  "Education",
  "Healthcare",
  "Other",
];

// Get today's date in Bangladesh
function getTodayDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  const day = parts.find((part) => part.type === "day").value;

  return `${year}-${month}-${day}`;
}

// Validate image URL
function isValidImageUrl(value) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

// Create event document
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

// Validate event data
export function isValidEvent(data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Title validation
  if (
    typeof data.title !== "string" ||
    data.title.trim().length < 3 ||
    data.title.trim().length > 100
  ) {
    return false;
  }

  // Description validation
  if (
    typeof data.description !== "string" ||
    data.description.trim().length < 10 ||
    data.description.trim().length > 2000
  ) {
    return false;
  }

  // Category validation
  if (!EVENT_CATEGORIES.includes(data.category)) {
    return false;
  }

  // Image URL validation
  if (
    typeof data.image !== "string" ||
    !isValidImageUrl(data.image.trim())
  ) {
    return false;
  }

  // Location validation
  if (
    typeof data.location !== "string" ||
    data.location.trim().length < 3 ||
    data.location.trim().length > 150
  ) {
    return false;
  }

  // Date format validation
  if (
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date)
  ) {
    return false;
  }

  // Check whether the date is a real calendar date
  const parsedDate = new Date(`${data.date}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== data.date
  ) {
    return false;
  }

  // Event date must be in the future
  if (data.date <= getTodayDate()) {
    return false;
  }

  return true;
}
