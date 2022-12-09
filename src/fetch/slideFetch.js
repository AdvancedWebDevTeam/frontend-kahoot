import { getRequest, postRequest } from "./httpClient";

export async function getAllSlides(presentId) {
    const url = `${process.env.REACT_APP_API_URL}/slides/show/${presentId}`;
    const result = await getRequest(url);
    return result.data;
}

export async function getNameAndCreator(presentId) {
    const url = `${process.env.REACT_APP_API_URL}/slides/creator/${presentId}`;
    const result = await getRequest(url);
    return result.data;
}

export async function getSlideTypes() {
    const url = `${process.env.REACT_APP_API_URL}/slides/type`;
    const result = await getRequest(url);
    return result.data;
}