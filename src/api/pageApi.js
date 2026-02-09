import api from "./axios";
import apiPublic from "./axiosPublic";
import { API } from "./endpoints";

// GET page data
export async function fetchPageSection(typeToCreate) {
  const res = await apiPublic.get(API.GET_PAGE_DATA, {
    params: { typeToCreate },
  });
  return res.data;
}

// UPDATE page data
export async function updatePageSection(typeToCreate, sectionData) {
  const keyMap = {
    OURSTORY: "ourStory",
    INTRODUCTION: "introduction",
    HEADERS: "headers",
    LINKS: "links",
    CONTACT: "contactRequest",
    PAYMENT: "paymentType",
  };

  const key = keyMap[typeToCreate];
  if (!key) {
    throw new Error(`Invalid typeToCreate: ${typeToCreate}`);
  }

  const body = {
    typeToCreate,
    [key]: sectionData,
  };

  const res = await api.put(API.UPDATE_PAGE_DATA, body);
  return res.data;
}

// CREATE page data
export async function createPageSection(typeToCreate, sectionData) {
  const keyMap = {
    OURSTORY: "ourStory",
    INTRODUCTION: "introduction",
    HEADERS: "headers",
    LINKS: "links",
    CONTACT: "contactRequest",
    PAYMENT: "paymentType",
  };

  const key = keyMap[typeToCreate];
  if (!key) {
    throw new Error(`Invalid typeToCreate: ${typeToCreate}`);
  }

  const body = {
    typeToCreate,
    [key]: sectionData,
  };

  const res = await api.post(API.CREATE_PAGE_DATA, body);
  return res.data;
}
