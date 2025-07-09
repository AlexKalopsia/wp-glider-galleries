(() => {

    const { registerBlockType } = wp.blocks;
    const { MediaUpload } = wp.blockEditor;
    const { Button } = wp.components;
    const { useState } = wp.element;
    const { useSelect } = wp.data;
    const { __ } = wp.i18n;

    // Always re-run "wp i18n make-json languages" to generate updated json translations

    const metadata = window.gliderGalleryBlock || {};

    registerBlockType('glider/gallery', {
        ...metadata,
        edit: function ({ attributes, setAttributes }) {
            const { ids } = attributes;

            const [images, setImages] = useState([]);

            const onSelectImages = function (selectedImages) {
                setAttributes({ ids: selectedImages.map(img => img.id) });
                setImages(selectedImages);
            };

            const fetchedImages = useSelect(
                (select) =>
                    ids
                        .map(id => select('core').getMedia(id))
                        .filter(Boolean),
                [ids]
            );

            const displayedImages = images.length ? images : fetchedImages;

            return wp.element.createElement(
                'div',
                { 
                    className: 'glider-block-editor',
                    style: { 
                        display: 'block',
                        maxWidth: '1068px',
                        margin: '0 auto',
                        padding: '15px'
                    }
                 },
                wp.element.createElement(MediaUpload, {
                    onSelect: onSelectImages,
                    allowedTypes: ['image'],
                    multiple: true,
                    gallery: true,
                    value: ids,
                    render: function ({ open }) {
                        return wp.element.createElement(
                            Button,
                            { onClick: open, isSecondary: true },
                            ids.length > 0 ? __('Edit Gallery', 'wp-glider-galleries') : __('Select Images', 'wp-glider-galleries')
                        );
                    }
                }),
                displayedImages.length > 0 &&
                wp.element.createElement(
                    'div',
                    { style: { marginTop: '1em', display: 'flex', gap: '5px', flexWrap: 'wrap' } },
                    displayedImages.map(img =>
                        wp.element.createElement('img', {
                            key: img.id,
                            src: img.media_details?.sizes?.thumbnail?.source_url || img.source_url,
                            alt: img.alt_text || '',
                            style: { width: '100px', height: 'auto', objectFit: 'cover', borderRadius: '4px' }
                        })
                    )
                )
            );
        },
        save: function () {
            return null;
        },
    });

})();