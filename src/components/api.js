import { API } from "../Config";

/**
 * GET page data by section type
 */
export async function fetchPageSection(typeToCreate) {
  const res = await fetch(
    `${API.BASE_URL}${API.GET_PAGE_DATA}?typeToCreate=${typeToCreate}`
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", text);
    throw new Error("Failed to fetch page section");
  }

  return res.json();
}

export async function updatePageSection(typeToCreate, sectionData) {
  // Map of typeToCreate to the backend key
  const keyMap = {
    OURSTORY: "ourStory",
    INTRODUCTION: "introduction",
    HEADERS: "headers",
    LINKS: "links",
    CONTACT: "contactRequest",
    PAYMENTTYPE: "paymentType",
  };

  const key = keyMap[typeToCreate];
  if (!key) {
    throw new Error(`Invalid typeToCreate: ${typeToCreate}`);
  }

  const body = {
    typeToCreate,
    [key]: sectionData, // Only send the relevant section
  };

  const res = await fetch(`${API.BASE_URL}${API.UPDATE_PAGE_DATA}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Update error:", text);
    throw new Error("Failed to update page section");
  }

  return res.json();
}
