import json
import re
import sys
import os
from slugify import slugify

DEFAULT_TEMPLATE_JSON = r'''
{
  "content": [
    {
      "id": "2903f49a",
      "settings": {
        "content_width": {
          "unit": "px",
          "size": 1320,
          "sizes": []
        },
        "gap": "extended",
        "overflow": "hidden",
        "background_background": "classic",
        "border_radius": {
          "unit": "px",
          "top": "0",
          "right": "0",
          "bottom": "45",
          "left": "45",
          "isLinked": false
        },
        "shape_divider_bottom_width": {
          "unit": "%",
          "size": 100,
          "sizes": []
        },
        "shape_divider_bottom_height": {
          "unit": "px",
          "size": 14,
          "sizes": []
        },
        "shape_divider_bottom_negative": "yes",
        "vertical_lines_class": "has-vertical-lines",
        "lines_z_index": 8,
        "lines_color": "#E61111",
        "margin": {
          "unit": "px",
          "top": "0",
          "right": 0,
          "bottom": "0",
          "left": 0,
          "isLinked": false
        },
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "7fcebdbb",
          "settings": {
            "_column_size": 100,
            "_inline_size": null
          },
          "elements": [
            {
              "id": "45119d3b",
              "settings": {
                "space": {
                  "unit": "vh",
                  "size": 8,
                  "sizes": []
                },
                "space_tablet": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                },
                "space_mobile": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                }
              },
              "elements": [],
              "isInner": false,
              "widgetType": "spacer",
              "elType": "widget"
            },
            {
              "id": "7571dc5e",
              "settings": {
                "title": "{{CLIENT_NAME}}",
                "header_size": "h1",
                "typography_typography": "custom",
                "typography_font_size": {
                  "unit": "px",
                  "size": 74,
                  "sizes": []
                },
                "typography_font_size_tablet": {
                  "unit": "rem",
                  "size": "",
                  "sizes": []
                },
                "typography_font_size_mobile": {
                  "unit": "px",
                  "size": 36,
                  "sizes": []
                },
                "typography_font_weight": "900",
                "typography_text_transform": "uppercase"
              },
              "elements": [],
              "isInner": false,
              "widgetType": "heading",
              "elType": "widget"
            },
            {
              "id": "9a81a92",
              "settings": {
                "space": {
                  "unit": "vh",
                  "size": 8,
                  "sizes": []
                },
                "space_tablet": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                },
                "space_mobile": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                },
                "hide_mobile": "hidden-mobile"
              },
              "elements": [],
              "isInner": false,
              "widgetType": "spacer",
              "elType": "widget"
            },
            {
              "id": "5019da3f",
              "settings": {
                "text": "Divider",
                "color": "#7E7E7E66"
              },
              "elements": [],
              "isInner": false,
              "widgetType": "divider",
              "elType": "widget"
            },
            {
              "id": "7ee3ffc1",
              "settings": {
                "layout": "full_width",
                "gap": "no",
                "structure": "20",
                "jet_parallax_layout_list": []
              },
              "elements": [
                {
                  "id": "66e32f82",
                  "settings": {
                    "_column_size": 50,
                    "_inline_size": null
                  },
                  "elements": [
                    {
                      "id": "18e75c92",
                      "settings": {
                        "title": "Description- <br><br>Website:  {{WEBSITE}} <br><br>\n{{SERVICE}} • {{INDUSTRY}}",
                        "header_size": "h4",
                        "typography_typography": "custom",
                        "typography_font_size": {
                          "unit": "px",
                          "size": 24,
                          "sizes": []
                        },
                        "typography_font_size_tablet": {
                          "unit": "px",
                          "size": 18,
                          "sizes": []
                        },
                        "typography_font_size_mobile": {
                          "unit": "px",
                          "size": 24,
                          "sizes": []
                        },
                        "_margin_mobile": {
                          "unit": "em",
                          "top": "0",
                          "right": "0",
                          "bottom": "1",
                          "left": "0",
                          "isLinked": false
                        }
                      },
                      "elements": [],
                      "isInner": false,
                      "widgetType": "heading",
                      "elType": "widget"
                    }
                  ],
                  "isInner": true,
                  "elType": "column"
                },
                {
                  "id": "982ebbd",
                  "settings": {
                    "_column_size": 50,
                    "_inline_size": null
                  },
                  "elements": [
                    {
                      "id": "76542890",
                      "settings": {
                        "editor": "<p><strong data-start=\"184\" data-end=\"196\">{{OVERVIEW_HEADING}}</strong><br data-start=\"196\" data-end=\"199\" />{{CLIENT_NAME}} is a two‑founder tween/teen lingerie startup seeking to build brand love among Gen Z. Pixelbee won a Hootsuite “Social Makeover” contest on Luna’s behalf—and in just <strong data-start=\"380\" data-end=\"393\">two weeks</strong> delivered <strong data-start=\"404\" data-end=\"426\">66 000 impressions</strong>, <strong data-start=\"428\" data-end=\"460\">108 % uplift in direct sales</strong>, and <strong data-start=\"466\" data-end=\"482\">8 hours/week</strong> saved in reporting.</p>",
                        "typography_typography": "custom",
                        "typography_font_size": {
                          "unit": "px",
                          "size": 24,
                          "sizes": []
                        },
                        "typography_line_height": {
                          "unit": "px",
                          "size": 38,
                          "sizes": []
                        },
                        "typography_font_size_tablet": {
                          "unit": "px",
                          "size": 18,
                          "sizes": []
                        },
                        "typography_line_height_tablet": {
                          "unit": "px",
                          "size": 28,
                          "sizes": []
                        },
                        "typography_line_height_mobile": {
                          "unit": "px",
                          "size": "",
                          "sizes": []
                        }
                      },
                      "elements": [],
                      "isInner": false,
                      "widgetType": "text-editor",
                      "elType": "widget"
                    }
                  ],
                  "isInner": true,
                  "elType": "column"
                }
              ],
              "isInner": true,
              "elType": "section"
            },
            {
              "id": "41056c76",
              "settings": {
                "space": {
                  "unit": "vh",
                  "size": 9,
                  "sizes": []
                },
                "space_tablet": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                },
                "space_mobile": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                }
              },
              "elements": [],
              "isInner": false,
              "widgetType": "spacer",
              "elType": "widget"
            }
          ],
          "isInner": false,
          "elType": "column"
        }
      ],
      "isInner": false,
      "elType": "section"
    },
    {
      "id": "4c5fe020",
      "settings": {
        "layout": "full_width",
        "content_width": {
          "unit": "px",
          "size": 1320,
          "sizes": []
        },
        "gap": "no",
        "overflow": "hidden",
        "margin": {
          "unit": "px",
          "top": "0",
          "right": 0,
          "bottom": "0",
          "left": 0,
          "isLinked": false
        },
        "padding": {
          "unit": "px",
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0",
          "isLinked": false
        },
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "60de10dc",
          "settings": {
            "_column_size": 100,
            "_inline_size": null
          },
          "elements": [],
          "isInner": false,
          "elType": "column"
        }
      ],
      "isInner": false,
      "elType": "section"
    },
    {
      "id": "49d9de9e",
      "settings": {
        "content_width": {
          "unit": "px",
          "size": 1320,
          "sizes": []
        },
        "gap": "extended",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "7c0d00cf",
          "settings": {
            "_column_size": 100,
            "_inline_size": null
          },
          "elements": [
            {
              "id": "5c46ed81",
              "settings": {
                "space": {
                  "unit": "vh",
                  "size": 4,
                  "sizes": []
                },
                "space_tablet": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                },
                "space_mobile": {
                  "unit": "vh",
                  "size": "",
                  "sizes": []
                }
              },
              "elements": [],
              "isInner": false,
              "widgetType": "spacer",
              "elType": "widget"
            },
            {
              "id": "283f26c1",
              "settings": {
                "title": "",
                "header_size": "h1",
                "typography_typography": "custom",
                "typography_font_size": {
                  "unit": "px",
                  "size": 74,
                  "sizes": []
                },
                "typography_font_size_tablet": {
                  "unit": "rem",
                  "size": "",
                  "sizes": []
                },
                "typography_font_size_mobile": {
                  "unit": "px",
                  "size": 36,
                  "sizes": []
                },
                "typography_font_weight": "900",
                "typography_text_transform": "uppercase"
              },
              "elements": [],
              "isInner": false,
              "widgetType": "heading",
              "elType": "widget"
            }
          ],
          "isInner": false,
          "elType": "column"
        }
      ],
      "isInner": false,
      "elType": "section"
    },
    {
      "id": "57c5636f",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "29301d06",
          "settings": {
            "title": "{{CHALLENGE_HEADING}}\n",
            "header_size": "h1",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 74,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "564d7b23",
      "settings": {
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "73d5e613",
          "settings": {
            "editor": "<p class=\"\" data-start=\"788\" data-end=\"881\">Despite having a thoughtfully designed product line, {{CLIENT_NAME}} faced several challenges:</p><ul data-start=\"882\" data-end=\"1087\"><li class=\"\" data-start=\"882\" data-end=\"944\"><p class=\"\" data-start=\"884\" data-end=\"944\"><strong data-start=\"884\" data-end=\"902\">Limited Reach:</strong> Fewer than 100 followers across platforms</p></li><li class=\"\" data-start=\"945\" data-end=\"1007\"><p class=\"\" data-start=\"947\" data-end=\"1007\"><strong data-start=\"947\" data-end=\"968\">Manual Reporting:</strong> Time-consuming data tracking processes</p></li><li class=\"\" data-start=\"1008\" data-end=\"1087\"><p class=\"\" data-start=\"1010\" data-end=\"1087\"><strong data-start=\"1010\" data-end=\"1033\">Budget Constraints:</strong> Necessity for impactful results with minimal ad spend</p></li></ul>",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 24,
              "sizes": []
            },
            "typography_line_height": {
              "unit": "px",
              "size": 38,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "px",
              "size": 18,
              "sizes": []
            },
            "typography_line_height_tablet": {
              "unit": "px",
              "size": 28,
              "sizes": []
            },
            "typography_line_height_mobile": {
              "unit": "px",
              "size": "",
              "sizes": []
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "text-editor",
          "elType": "widget"
        },
        {
          "id": "2c675bf5",
          "settings": [],
          "elements": [],
          "isInner": false,
          "widgetType": "spacer",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "2fe653cc",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "6820eb2",
          "settings": {
            "title": "{{APPROACH_HEADING}}\n",
            "header_size": "h1",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 74,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase",
            "align": "left"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        },
        {
          "id": "4ac0f8ba",
          "settings": {
            "editor": "<ul><li class=\"\" data-start=\"1118\" data-end=\"1415\"><p class=\"\" data-start=\"1121\" data-end=\"1158\"><strong data-start=\"1121\" data-end=\"1158\">Comprehensive Audit &amp; KPI Setting</strong></p><ul data-start=\"1162\" data-end=\"1415\"><li class=\"\" data-start=\"1162\" data-end=\"1250\"><p class=\"\" data-start=\"1164\" data-end=\"1250\">Evaluated existing social media profiles on Facebook, Instagram, TikTok, and Pinterest</p></li><li class=\"\" data-start=\"1254\" data-end=\"1334\"><p class=\"\" data-start=\"1256\" data-end=\"1334\">Established a content ratio of 1/3 promotional to 2/3 engagement-focused posts</p></li><li class=\"\" data-start=\"1338\" data-end=\"1415\"><p class=\"\" data-start=\"1340\" data-end=\"1415\">Defined clear targets: impressions, engagement rates, and sales attribution</p></li></ul></li><li class=\"\" data-start=\"1417\" data-end=\"1696\"><p class=\"\" data-start=\"1420\" data-end=\"1449\"><strong data-start=\"1420\" data-end=\"1449\">Tailored Content Creation</strong></p><ul data-start=\"1453\" data-end=\"1696\"><li class=\"\" data-start=\"1453\" data-end=\"1543\"><p class=\"\" data-start=\"1455\" data-end=\"1543\"><strong data-start=\"1455\" data-end=\"1484\">Instagram Reels &amp; TikTok:</strong> Produced quick styling tutorials for first-time bra buyers</p></li><li class=\"\" data-start=\"1547\" data-end=\"1616\"><p class=\"\" data-start=\"1549\" data-end=\"1616\"><strong data-start=\"1549\" data-end=\"1570\">Pinterest Boards:</strong> Curated mood boards showcasing fabric stories</p></li><li class=\"\" data-start=\"1620\" data-end=\"1696\"><p class=\"\" data-start=\"1622\" data-end=\"1696\"><strong data-start=\"1622\" data-end=\"1643\">Facebook Stories:</strong> Implemented interactive polls to engage the audience</p></li></ul></li><li class=\"\" data-start=\"1698\" data-end=\"1937\"><p class=\"\" data-start=\"1701\" data-end=\"1729\"><strong data-start=\"1701\" data-end=\"1729\">Analytics &amp; Optimization</strong></p><ul data-start=\"1733\" data-end=\"1937\"><li class=\"\" data-start=\"1733\" data-end=\"1786\"><p class=\"\" data-start=\"1735\" data-end=\"1786\">Deployed Hootsuite dashboards to automate reporting</p></li><li class=\"\" data-start=\"1790\" data-end=\"1855\"><p class=\"\" data-start=\"1792\" data-end=\"1855\">Monitored performance metrics to reallocate budgets effectively</p></li><li class=\"\" data-start=\"1859\" data-end=\"1937\"><p class=\"\" data-start=\"1861\" data-end=\"1937\">Resulted in reclaiming 8 hours per week previously spent on manual reporting</p></li></ul></li><li class=\"\" data-start=\"1939\" data-end=\"2127\"><p class=\"\" data-start=\"1942\" data-end=\"1966\"><strong data-start=\"1942\" data-end=\"1966\">Community Engagement</strong></p><ul data-start=\"1970\" data-end=\"2127\"><li class=\"\" data-start=\"1970\" data-end=\"2050\"><p class=\"\" data-start=\"1972\" data-end=\"2050\">Utilized Hootsuite Listening to monitor brand mentions and competitor activity</p></li><li class=\"\" data-start=\"2054\" data-end=\"2127\"><p class=\"\" data-start=\"2056\" data-end=\"2127\">Ensured timely responses to comments and direct messages within 2 hours</p></li></ul></li><li class=\"\" data-start=\"2129\" data-end=\"2316\"><p class=\"\" data-start=\"2132\" data-end=\"2165\"><strong data-start=\"2132\" data-end=\"2165\">Targeted Advertising Campaign</strong></p><ul data-start=\"2169\" data-end=\"2316\"><li class=\"\" data-start=\"2169\" data-end=\"2237\"><p class=\"\" data-start=\"2171\" data-end=\"2237\">Invested $5,000 in Instagram and Facebook ads over a 14-day period</p></li><li class=\"\" data-start=\"2241\" data-end=\"2316\"><p class=\"\" data-start=\"2243\" data-end=\"2316\">A/B tested various creative formats to maximize return on ad spend (ROAS)</p></li></ul></li></ul>",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 24,
              "sizes": []
            },
            "typography_line_height": {
              "unit": "px",
              "size": 38,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "px",
              "size": 18,
              "sizes": []
            },
            "typography_line_height_tablet": {
              "unit": "px",
              "size": 28,
              "sizes": []
            },
            "typography_line_height_mobile": {
              "unit": "px",
              "size": "",
              "sizes": []
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "text-editor",
          "elType": "widget"
        },
        {
          "id": "2c71b222",
          "settings": [],
          "elements": [],
          "isInner": false,
          "widgetType": "spacer",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "122ec3a0",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "47171ec6",
          "settings": {
            "title": "{{CAMPAIGN_HIGHLIGHTS_HEADING}}\n\n",
            "header_size": "h1",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 74,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase",
            "align": "left"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        },
        {
          "id": "32635219",
          "settings": {
            "editor": "<table><thead><tr><th>Metric</th><th>Result</th></tr></thead><tbody><tr><td>Impressions</td><td>{{METRIC_IMPRESSIONS}}</td></tr><tr><td>Direct Sales Increase</td><td>{{METRIC_SALES_INCREASE}}</td></tr><tr><td>Reporting Time Saved</td><td>{{METRIC_REPORTING_SAVED}}</td></tr><tr><td>New Followers</td><td>{{METRIC_NEW_FOLLOWERS}}</td></tr></tbody></table>",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 24,
              "sizes": []
            },
            "typography_line_height": {
              "unit": "px",
              "size": 38,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "px",
              "size": 18,
              "sizes": []
            },
            "typography_line_height_tablet": {
              "unit": "px",
              "size": 28,
              "sizes": []
            },
            "typography_line_height_mobile": {
              "unit": "px",
              "size": "",
              "sizes": []
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "text-editor",
          "elType": "widget"
        },
        {
          "id": "429d8704",
          "settings": [],
          "elements": [],
          "isInner": false,
          "widgetType": "spacer",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "5d8ba1ec",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "60efa624",
          "settings": {
            "title": "{{TIMELINE_HEADING}}",
            "header_size": "h1",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 74,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase",
            "align": "left"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        },
        {
          "id": "6af4e4ed",
          "settings": {
            "editor": "<ul><li class=\"\" data-start=\"2676\" data-end=\"2756\"><p class=\"\" data-start=\"2678\" data-end=\"2756\"><strong data-start=\"2678\" data-end=\"2689\">Week 1:</strong> Conducted audit, strategy workshop, and developed content calendar</p></li><li class=\"\" data-start=\"2757\" data-end=\"2820\"><p class=\"\" data-start=\"2759\" data-end=\"2820\"><strong data-start=\"2759\" data-end=\"2770\">Week 2:</strong> Produced creative assets (Reels, Stories, Boards)</p></li><li class=\"\" data-start=\"2821\" data-end=\"2896\"><p class=\"\" data-start=\"2823\" data-end=\"2896\"><strong data-start=\"2823\" data-end=\"2837\">Days 8–14:</strong> Launched paid media campaigns with real-time optimizations</p></li><li class=\"\" data-start=\"2897\" data-end=\"2970\"><p class=\"\" data-start=\"2899\" data-end=\"2970\"><strong data-start=\"2899\" data-end=\"2911\">Ongoing:</strong> Maintained daily engagement and weekly performance reviews</p></li></ul>",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 24,
              "sizes": []
            },
            "typography_line_height": {
              "unit": "px",
              "size": 38,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "px",
              "size": 18,
              "sizes": []
            },
            "typography_line_height_tablet": {
              "unit": "px",
              "size": 28,
              "sizes": []
            },
            "typography_line_height_mobile": {
              "unit": "px",
              "size": "",
              "sizes": []
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "text-editor",
          "elType": "widget"
        },
        {
          "id": "2119beab",
          "settings": [],
          "elements": [],
          "isInner": false,
          "widgetType": "spacer",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "7f410f32",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "115bb3b7",
          "settings": {
            "title": "{{TOOLS_HEADING}}\n\n",
            "header_size": "h1",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 74,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase",
            "align": "left"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        },
        {
          "id": "68d4ce1f",
          "settings": {
            "editor": "<ul><li class=\"\" data-start=\"3002\" data-end=\"3041\"><p class=\"\" data-start=\"3004\" data-end=\"3041\"><strong data-start=\"3004\" data-end=\"3031\">Publishing &amp; Analytics:</strong> Hootsuite</p></li><li class=\"\" data-start=\"3042\" data-end=\"3094\"><p class=\"\" data-start=\"3044\" data-end=\"3094\"><strong data-start=\"3044\" data-end=\"3063\">Creative Suite:</strong> Canva Pro, in-app video editor</p></li><li class=\"\" data-start=\"3095\" data-end=\"3136\"><p class=\"\" data-start=\"3097\" data-end=\"3136\"><strong data-start=\"3097\" data-end=\"3118\">Social Listening:</strong> Hootsuite Streams</p></li><li class=\"\" data-start=\"3137\" data-end=\"3208\"><p class=\"\" data-start=\"3139\" data-end=\"3208\"><strong data-start=\"3139\" data-end=\"3164\">Advertising Platform:</strong> Facebook Ads Manager (Instagram &amp; Facebook)</p></li></ul>",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 24,
              "sizes": []
            },
            "typography_line_height": {
              "unit": "px",
              "size": 38,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "px",
              "size": 18,
              "sizes": []
            },
            "typography_line_height_tablet": {
              "unit": "px",
              "size": 28,
              "sizes": []
            },
            "typography_line_height_mobile": {
              "unit": "px",
              "size": "",
              "sizes": []
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "text-editor",
          "elType": "widget"
        },
        {
          "id": "56feac7a",
          "settings": [],
          "elements": [],
          "isInner": false,
          "widgetType": "spacer",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    },
    {
      "id": "313192a0",
      "settings": {
        "flex_direction": "column",
        "jet_parallax_layout_list": []
      },
      "elements": [
        {
          "id": "212e588f",
          "settings": {
            "title": "{{TESTIMONIAL_HEADING}}\n",
            "header_size": "h5",
            "typography_typography": "custom",
            "typography_font_size": {
              "unit": "px",
              "size": 35,
              "sizes": []
            },
            "typography_font_size_tablet": {
              "unit": "rem",
              "size": "",
              "sizes": []
            },
            "typography_font_size_mobile": {
              "unit": "px",
              "size": 36,
              "sizes": []
            },
            "typography_font_weight": "900",
            "typography_text_transform": "uppercase",
            "align": "left"
          },
          "elements": [],
          "isInner": false,
          "widgetType": "heading",
          "elType": "widget"
        },
        {
          "id": "18d6ab20",
          "settings": {
            "{{TESTIMONIAL_HEADING}}_content": "{{TESTIMONIAL_TEXT}}",
            "{{TESTIMONIAL_HEADING}}_image": {
              "url": "https://theme.madsparrow.me/most/wp-content/uploads/2022/10/most_Master-Avatar-2.png",
              "id": 1314,
              "alt": "",
              "source": "library"
            },
            "{{TESTIMONIAL_HEADING}}_name": "{{TESTIMONIAL_NAME}}",
            "{{TESTIMONIAL_HEADING}}_job": "{{TESTIMONIAL_ROLE}}",
            "{{TESTIMONIAL_HEADING}}_alignment": "left",
            "_padding": {
              "unit": "px",
              "top": "20",
              "right": "24",
              "bottom": "20",
              "left": "24",
              "isLinked": false
            },
            "_background_background": "classic",
            "_background_color": "#FFFFFF",
            "_border_radius": {
              "unit": "px",
              "top": "24",
              "right": "24",
              "bottom": "24",
              "left": "24",
              "isLinked": true
            },
            "content_typography_typography": "custom",
            "content_typography_font_size": {
              "unit": "px",
              "size": 16,
              "sizes": []
            },
            "name_typography_typography": "custom",
            "name_typography_font_weight": "700",
            "job_typography_typography": "custom",
            "content_content_color": "#262626",
            "name_text_color": "#262626",
            "job_text_color": "#262626",
            "__dynamic__": {
              "{{TESTIMONIAL_HEADING}}_image": "[elementor-tag id=\"a543277\" name=\"post-featured-image\" settings=\"%7B%7D\"]"
            }
          },
          "elements": [],
          "isInner": false,
          "widgetType": "{{TESTIMONIAL_HEADING}}",
          "elType": "widget"
        }
      ],
      "isInner": false,
      "elType": "container"
    }
  ],
  "page_settings": [],
  "version": "0.4",
  "title": "dsa",
  "type": "page"
}

'''

try:
    import openai
except ImportError:
    openai = None

def sanitize(text: str) -> str:
    text = text.replace('\r', '')
    text = text.replace('\u2018', "'").replace('\u2019', "'")
    text = text.replace('\u201c', '"').replace('\u201d', '"')
    text = text.strip()
    return text

def parse_raw(text: str) -> dict:
    sections = {}
    lines = [l.strip() for l in text.split('\n')]
    key_value_pattern = re.compile(r'^(.*?):\s*(.*)$')
    current_key = None
    buffer = []
    for line in lines + ['']:
        m = key_value_pattern.match(line)
        if m:
            if current_key:
                sections[current_key] = sanitize('\n'.join(buffer))
                buffer = []
            key, value = m.groups()
            if value:
                sections[key.lower()] = sanitize(value)
                current_key = None
            else:
                current_key = key.lower()
        elif line == '' and current_key:
            sections[current_key] = sanitize('\n'.join(buffer))
            current_key = None
            buffer = []
        else:
            if current_key is None and line:
                current_key = line.lower()
                buffer = []
            elif current_key:
                buffer.append(line)
    # combine timeline entries
    timeline_items = []
    for k in list(sections.keys()):
        if re.match(r'week \d+', k) or k.startswith('days') or k == 'ongoing':
            timeline_items.append(f"{k.title()}: {sections.pop(k)}")
    if timeline_items:
        sections['timeline'] = '\n'.join(timeline_items)

    # normalize common keys
    key_map = {
        'the challenge': 'challenge',
        'pixelbee\u2019s approach': 'approach',
        'key achievements': 'highlights',
    }
    for old, new in key_map.items():
        if old in sections and new not in sections:
            sections[new] = sections.pop(old)

    if 'client testimonial' in sections:
        text = sections['client testimonial']
        if '\n' in text:
            quote, attrib = text.split('\n', 1)
            sections['testimonial_text'] = quote.strip('"')
            if '—' in attrib:
                name, role = attrib.split('—', 1)[-1].split(',', 1)
                sections['testimonial_name'] = name.strip()
                sections['testimonial_role'] = role.strip()
    return sections

def call_gpt(prompt: str) -> dict:
    if not openai:
        raise RuntimeError("openai package not installed")
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('OPENAI_API_KEY not set')
    openai.api_key = api_key
    messages = [
        {"role": "system", "content": "You are a content editor and JSON helper for Elementor. Your job is to fix grammar, expand short bullet points, and fill missing sections when needed. Keep output professional and precise."},
        {"role": "user", "content": prompt}
    ]
    response = openai.ChatCompletion.create(model="gpt-4o", messages=messages)
    content = response.choices[0].message.content
    return json.loads(content)

def fill_template(template: dict, data: dict) -> dict:
    pattern = re.compile(r'{{(.*?)}}')
    def replace(value: str) -> str:
        for match in pattern.findall(value):
            key = match.lower()
            simple_key = key.replace('_html', '').replace('_text', '')
            replacement = data.get(key, data.get(simple_key, ''))
            value = value.replace('{{' + match + '}}', replacement)
        return value
    def walk(node):
        if isinstance(node, dict):
            return {replace(k): walk(v) for k, v in node.items()}
        elif isinstance(node, list):
            return [walk(x) for x in node]
        elif isinstance(node, str):
            return replace(node)
        else:
            return node
    return walk(template)

def check_placeholders(obj: dict):
    text = json.dumps(obj)
    leftovers = re.findall(r'{{.*?}}', text)
    if leftovers:
        raise ValueError(f'Unreplaced placeholders found: {set(leftovers)}')

def generate_case_study(raw: str, template: dict | None = None) -> tuple[dict, str]:
    """Return filled template dict and slug for filename."""
    if template is None:
        template = json.loads(DEFAULT_TEMPLATE_JSON)

    parsed = parse_raw(raw)

    prompt = f"Here is the raw data:\n\n{raw}\n\nPlease return JSON with cleaned sections."
    try:
        enhanced = call_gpt(prompt)
        for k, v in enhanced.items():
            parsed[k.lower()] = v
    except Exception as e:
        print('GPT call failed:', e, file=sys.stderr)

    result = fill_template(template, parsed)
    check_placeholders(result)

    slug = slugify(parsed.get('client', 'case-study'))
    return result, slug


def main():
    if len(sys.argv) < 2:
        print('Usage: python3 generate.py INPUT.txt [TEMPLATE.json]')
        sys.exit(1)
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        raw = f.read()
    template = None
    if len(sys.argv) > 2:
        with open(sys.argv[2], 'r', encoding='utf-8') as tf:
            template = json.load(tf)

    result, slug = generate_case_study(raw, template)
    filename = f'case-study-{slug}_GOOD_FILE.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print('Generated', filename)

if __name__ == '__main__':
    main()
