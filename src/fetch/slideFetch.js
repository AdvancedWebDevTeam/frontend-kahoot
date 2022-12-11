import { getRequest, postRequest, patchRequest } from "./httpClient";

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

export async function addSlide(presentId, typeId, content){
    const url = `${process.env.REACT_APP_API_URL}/slides/add`;
    const data = {
        presentId: presentId,
        typeId: typeId,
        content: content
    }
    const result = await postRequest(url, data);
    return result.data;
}

export async function updateSlide (slideId, presentId, typeId, content) {
    const url = `${process.env.REACT_APP_API_URL}/slides/edit`;
    const data = {
        slideId: slideId,
        presentId: presentId,
        typeId: typeId,
        content: content
    }
    const result = await patchRequest(url, data);
    return result.data;
}