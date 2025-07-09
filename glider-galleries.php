<?php
/**
 * Plugin Name: WP Glider Galleries
 * Plugin URI: https://github.com/AlexKalopsia/wp-glider-galleries
 * Description: Simple plugin that replaces Jetpack slideshows and adds a block to create new Glider galleries.
 * Author: Alex Camilleri
 * Version: 0.1
 * 
 */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('glider-cdn', 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.css');
    wp_enqueue_style('glider-custom', plugins_url('style.css', __FILE__), ['glider-cdn']);
    wp_enqueue_script('glider-js', 'https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js', [], null, true);
    wp_add_inline_script('glider-js', "
        window.addEventListener('load', function () {
            document.querySelectorAll('.glider').forEach(function (el) {
                const prev = el.parentElement.querySelector('.glider-prev');
                const next = el.parentElement.querySelector('.glider-next');
                const dots = el.parentElement.querySelector('.glider-dots');

                const glider = new Glider(el, {
                    slidesToShow: 1,
                    dots: dots,
                });

                if (prev) {
                    prev.addEventListener('click', () => {
                        glider.scrollItem(glider.slide - 1, true);
                    });
                }
                if (next) {
                    next.addEventListener('click', () => {
                        glider.scrollItem(glider.slide + 1, true);
                    });
                }
            });
        });
    ");
});

// Shortcode: [glider_gallery ids="123,124,125"]
add_shortcode('glider_gallery', function ($atts) {
    $atts = shortcode_atts([
        'ids' => '',
        'size' => 'large',
    ], $atts);

    $ids = array_map('trim', explode(',', $atts['ids']));
    $html = '<div class="glider-wrapper"><div class="glider">';

    foreach ($ids as $id) {
        $img_url = wp_get_attachment_image_url($id, $atts['size']);
        if ($img_url) {
            $html .= '<div><img src="' . esc_url($img_url) . '" alt=""></div>';
        }
    }

    $html .= '</div>';
    $html .= '<button class="glider-prev">«</button>';
    $html .= '<button class="glider-next">»</button>';
    $html .= '<div role="tablist" class="glider-dots"></div>';
    $html .= '</div>';

    return $html;
});

// Convert Jetpack slideshow
add_filter('render_block', function($block_content, $block) {
    if ($block['blockName'] === 'jetpack/slideshow' && !empty($block['attrs']['ids'])) {
        $ids = implode(',', array_map('intval', $block['attrs']['ids']));
        return do_shortcode('[glider_gallery ids="' . esc_attr($ids) . '"]');
    }
    return $block_content;
}, 10, 2);

function glider_register_block() {
    wp_register_script(
        'glider-block',
        plugins_url('block.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data', 'wp-media-utils'],
        filemtime(plugin_dir_path(__FILE__) . 'block.js'),
        true
    );

    register_block_type('glider/gallery', [
        'editor_script' => 'glider-block',
        'render_callback' => function ($attributes) {
            $ids = implode(',', array_map('intval', $attributes['ids'] ?? []));
            return do_shortcode("[glider_gallery ids=\"$ids\"]");
        },
        'attributes' => [
            'ids' => [
                'type' => 'array',
                'default' => [],
                'items' => [
                    'type' => 'number'
                ],
            ],
        ],
    ]);
}
add_action('init', 'glider_register_block');

add_action('admin_enqueue_scripts', function () {
    wp_enqueue_script('glider-block');
});

add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('glider-block');
});

add_action('wp_head', function () {
    echo '<style>
        .glider-prev, .glider-next {
            pointer-events: auto !important;
            cursor: pointer;
            z-index: 2;
        }
    </style>';
});

