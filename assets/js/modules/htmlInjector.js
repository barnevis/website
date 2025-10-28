async function fetchHTML(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Could not fetch ${filePath}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        return ''; // بازگشت رشته خالی در صورت خطا
    }
}

export async function injectHTML() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        const headerHTML = await fetchHTML('components/_header.html');
        headerPlaceholder.innerHTML = headerHTML;
    }

    if (footerPlaceholder) {
        const footerHTML = await fetchHTML('components/_footer.html');
        footerPlaceholder.innerHTML = footerHTML;
    }
}
