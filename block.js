const { registerBlockType } = wp.blocks;
const { MediaUpload } = wp.blockEditor;
const { Button } = wp.components;

registerBlockType('glider/gallery', {
    title: 'Glider Gallery',
    icon: 'images-alt2',
    category: 'media',
    attributes: {
        ids: { type: 'array', default: [] },
    },
    edit: function ({ attributes, setAttributes }) {
        const { ids } = attributes;

        const onSelectImages = function (images) {
            setAttributes({ ids: images.map(function (img) { return img.id; }) });
        };

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
            ids.length > 0 &&
                wp.element.createElement(
                    'p',
                    null,
                    ids.length + ' image(s) selected.'
                )
        );
    },
    save: function () {
        return null;
    },
});
