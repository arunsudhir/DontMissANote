var MetadataFilters = function () {
    
    function applyCutOffAndTermFilter(paragraphsMetadata, term, cutOffDate) {
        var filteredParagraphsMetadata = [];
        for (var p = 0; p < paragraphsMetadata.length; p++) {
            // Does this paragraph have a recent date?
            if (paragraphsMetadata[p].lastModifiedTime > cutOffDate) {
                // Does it match the search term? (remove whitespace chars and make lowercase
                if (paragraphsMetadata[p].text.toLowerCase().replace(/\s/g, '').indexOf(term.toLowerCase()) != -1) {
                    filteredParagraphsMetadata.push(paragraphsMetadata[p]);
                }
            }
        }
        return filteredParagraphsMetadata;
    }
    
    function getFilteredPagesMetadata(pagesMetadata, term, cutOffDate) {
        var filteredPagesMetadata = [];
        var dateLimitForNewPages = new Date();
        // Discovered bug in API - lastModifiedTime isn't being updated for pages that come from OneDrive
        dateLimitForNewPages.setHours(dateLimitForNewPages.getHours() - 3); // Consider new pages only when they are created in the last 3 hours
        for (var p = 0; p < pagesMetadata.length; p++) {
            var filteredParagraphs = applyCutOffAndTermFilter(pagesMetadata[p].paragraphs, term, cutOffDate);
            var filteredImages = applyCutOffAndTermFilter(pagesMetadata[p].images, term, cutOffDate);
            if (filteredParagraphs.length > 0 || filteredImages.length > 0) {
                var page = pagesMetadata[p];
                var newPageMetadata =
                {
                    lastModifiedTime: page.lastModifiedTime,
                    pageTitle: page.pageTitle,
                    pageId : page.pageId,
                    createdBy : page.createdBy,
                    createdTime : page.createdTime,
                    paragraphs: filteredParagraphs,
                    images: filteredImages,
                    pageWebUrl: page.pageWebUrl,
                    pageClientUrl: page.pageClientUrl,
                    isNew: page.createdTime > dateLimitForNewPages
                };
                filteredPagesMetadata.push(newPageMetadata);
            }
        }
        return filteredPagesMetadata;
    }
    
    this.getTermsMetadata = function (pagesMetadata, terms) {
        var cutOffDate = new Date();
        cutOffDate.setDate(cutOffDate.getDate() - 1); // Go back one day!
        var termsMetadata = [];
        for (var t = 0; t < terms.length; t++) {
            var filteredPagesMetadata = getFilteredPagesMetadata(pagesMetadata, terms[t], cutOffDate);
            if (filteredPagesMetadata.length > 0) {
                termsMetadata.push(
                    {
                        name: terms[t],
                        pages: filteredPagesMetadata
                    }
                );
            }
        }
        return termsMetadata;
    };
};

module.exports = new MetadataFilters();