define(function () {
    'use strict';

    return {
        questionTypes: {
            multipleSelect: 'multipleSelect',
            fillInTheBlank: 'fillInTheBlank',
            dragAndDrop: 'dragAndDropText',
            singleSelectText: 'singleSelectText',
            singleSelectImage: 'singleSelectImage',
            textMatching: 'textMatching',
            hotspot: 'hotspot',
            statement: 'statement',
            informationContent: 'informationContent',
            openQuestion: 'openQuestion',
            scenario: 'scenario',
            rankingText: 'rankingText'
        },
        defaultImageUrl: 'css/img/single-select-image-anwer.png',
        events: {
            appClosed: 'appClosed',
            onError: 'onError',
            appInitialized: 'appInitialized',
            imagePreviewClosed: 'image:preview:closed'
        },
        localStorageProgressKey: 'course_progress',
        localStorageResultKey: 'course_result',
        course: {
            statuses: {
                completed: 'completed',
                failed: 'failed',
                inProgress: 'inProgress'
            }
        },
        progressContext: {
            statuses: {
                undefined: 'undefined',
                saved: 'saved',
                error: 'error',
                ignored: 'ignored'
            }
        },
        documents: {
            types: {
                pdf: 'pdf',
                word: 'word',
                exel: 'exel',
                powerpoint: 'powerpoint',
                zip: 'zip'
            },
            downloadLocalizationKey: '[download]',
            containerSelector: '.document-container',
            sizeAttrName: 'data-document-size-kb',
            typeAttrName: 'data-document-type',
            downloadBtnSelector: '.download-document-btn'
        }
    };

});