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
        edit: function ({ attributes, setAttributes, context }) {
            const { ids = [] } = attributes;

            if (context?.isPreview) {
                return wp.element.createElement('img', {
                    src: metadata.previewImageUrl,
                    alt: __('Example Glider Gallery Preview', 'wp-glider-galleries'),
                    style: { width: '100%', height: 'auto', border: '1px solid #ccc' },
                });
            }
        

            const images = useSelect(
                (select) => ids.map((id) => select('core').getMedia(id)).filter(Boolean),
                [ids]
            );

            const onSelectImages = (selectedImages) => {
                const newIds = selectedImages.map((img) => img.id);
                setAttributes({ ids: newIds });
            };

            return (
                wp.element.createElement('div', {
                    className: 'glider-block-editor',
                    style: {
                        display: 'block',
                        maxWidth: '1068px',
                        margin: '0 auto',
                        padding: '15px',
                    },
                },
                    wp.element.createElement(MediaUpload, {
                        onSelect: onSelectImages,
                        allowedTypes: ['image'],
                        multiple: true,
                        gallery: true,
                        value: ids,
                        render: ({ open }) =>
                            wp.element.createElement(Button, { onClick: open, isSecondary: true },
                                ids.length > 0
                                    ? __('Edit Gallery', 'wp-glider-galleries')
                                    : __('Select Images', 'wp-glider-galleries')
                            ),
                    }),
                    images.length > 0 &&
                    wp.element.createElement('div', {
                        style: {
                            marginTop: '1em',
                            display: 'flex',
                            gap: '5px',
                            flexWrap: 'wrap',
                        },
                    },
                        images.map((img) =>
                            wp.element.createElement('img', {
                                key: img.id,
                                src: img.media_details?.sizes?.thumbnail?.source_url || img.source_url,
                                alt: img.alt_text || '',
                                style: {
                                    width: '100px',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                },
                            })
                        )
                    )
                )
            );
        },
        save: function () {
            return null;
        },
    });

})();