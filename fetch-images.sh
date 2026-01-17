#!/bin/bash

# Freepik API Image Fetcher for AZ Entreprenør
API_KEY="FPSX16ea10a2ecf0f342b45d9a1ad35dde33"
BASE_DIR="/Users/josuekongolo/Downloads/nettsider/bygg/Gruppe3/az-entreprenor/images"

# Function to search and download image
fetch_image() {
    local search_term="$1"
    local output_path="$2"
    local output_name="$3"

    echo "Searching for: $search_term"

    # URL encode the search term
    encoded_term=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$search_term'))")

    # Search for images (simpler query without filters)
    search_result=$(curl -s -X GET "https://api.freepik.com/v1/resources?locale=en-US&page=1&limit=5&order=relevance&term=${encoded_term}" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract first image ID using python for better JSON parsing
    image_id=$(echo "$search_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['data'][0]['id'] if data.get('data') else '')" 2>/dev/null)

    if [ -z "$image_id" ]; then
        echo "  No images found for: $search_term"
        return 1
    fi

    echo "  Found image ID: $image_id"

    # Get download URL
    download_result=$(curl -s -X GET "https://api.freepik.com/v1/resources/${image_id}/download" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract download URL using python
    download_url=$(echo "$download_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('url', ''))" 2>/dev/null)

    if [ -z "$download_url" ]; then
        echo "  Could not get download URL"
        return 1
    fi

    echo "  Downloading to: ${output_path}/${output_name}"

    # Create directory if needed
    mkdir -p "$output_path"

    # Download the image
    curl -s -L "$download_url" -o "${output_path}/${output_name}"

    if [ -f "${output_path}/${output_name}" ] && [ -s "${output_path}/${output_name}" ]; then
        echo "  Downloaded successfully!"
        return 0
    else
        echo "  Download failed"
        return 1
    fi
}

echo "=========================================="
echo "Fetching images for AZ Entreprenør website"
echo "=========================================="
echo ""

# 1. Hero image - modern bathroom with tiles
echo "[1/7] Hero Image"
fetch_image "modern bathroom tiles" "$BASE_DIR/hero" "hero-bathroom.jpg"
echo ""

# 2. Tile bathroom service
echo "[2/7] Tile Bathroom Service Image"
fetch_image "bathroom tile work" "$BASE_DIR/services" "tile-bathroom.jpg"
echo ""

# 3. Flooring installation
echo "[3/7] Flooring Installation Image"
fetch_image "wood floor installation" "$BASE_DIR/services" "flooring-install.jpg"
echo ""

# 4. Floor leveling
echo "[4/7] Floor Leveling Image"
fetch_image "floor construction renovation" "$BASE_DIR/services" "floor-leveling.jpg"
echo ""

# 5. Wetroom membrane
echo "[5/7] Wetroom Membrane Image"
fetch_image "bathroom renovation waterproof" "$BASE_DIR/services" "wetroom-membrane.jpg"
echo ""

# 6. Flooring work (about section)
echo "[6/7] Flooring Work Image"
fetch_image "flooring parquet interior" "$BASE_DIR/services" "flooring-work.jpg"
echo ""

# 7. Professional work (about page)
echo "[7/7] Professional Work Image"
fetch_image "home renovation interior" "$BASE_DIR/services" "professional-work.jpg"
echo ""

echo "=========================================="
echo "Image fetching complete!"
echo "=========================================="

# List downloaded images
echo ""
echo "Downloaded images:"
find "$BASE_DIR" -name "*.jpg" -type f 2>/dev/null | while read f; do
    size=$(ls -lh "$f" | awk '{print $5}')
    echo "  $f ($size)"
done
