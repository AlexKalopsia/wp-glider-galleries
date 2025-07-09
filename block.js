const { registerBlockType } = wp.blocks;
const { MediaUpload } = wp.blockEditor;
const { Button } = wp.components;
const { useState } = wp.element;
const { useSelect } = wp.data;

registerBlockType('glider/gallery', {
    title: 'Glider Gallery',
    icon: 'images-alt2',
    category: 'media',
    attributes: {
        ids: { type: 'array', default: [] },
    },
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
            { className: 'glider-block-editor' },
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
                        ids.length > 0 ? 'Edit Gallery' : 'Select Images'
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