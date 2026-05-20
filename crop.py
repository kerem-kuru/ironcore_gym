from PIL import Image, ImageDraw

def process_image():
    input_path = "public/logo.png"
    output_path = "public/logo.png"
    
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    print(f"Original size: {width}x{height}")
    
    # The image is 1024x558. The circular logo is in the middle.
    # Diameter is likely the height (558), so radius is 279.
    # We crop the square (width/2 - radius, 0, width/2 + radius, height)
    
    # But wait, let's make it more robust. Find the bounds programmatically but better.
    # A circular logo in a transparent/checkerboard background.
    
    # Just crop the center square.
    diameter = min(width, height)
    center_x = width // 2
    center_y = height // 2
    
    # Kenarlardan fazladan ne kadar kırpmak istediğinizi buradan ayarlayabilirsiniz
    margin = 50
    radius = (diameter // 2) - margin
    
    min_x = center_x - radius
    min_y = center_y - radius
    max_x = center_x + radius
    max_y = center_y + radius
    
    print(f"Cropping to: {min_x}, {min_y}, {max_x}, {max_y}")
    
    cropped = img.crop((min_x, min_y, max_x, max_y))
    
    size = cropped.size[0]
    
    # Apply a perfect circular mask
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    # Draw a smooth ellipse, pull in by 2 pixels to remove any rough edges
    draw.ellipse((2, 2, size-3, size-3), fill=255)
    
    final_img = cropped.copy()
    final_img.putalpha(mask)
    
    final_img.save(output_path, "PNG")
    print("Done! Saved as perfect circle.")

if __name__ == "__main__":
    process_image()
