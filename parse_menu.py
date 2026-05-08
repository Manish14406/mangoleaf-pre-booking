import json

def parse_menu():
    with open('menus.txt', 'r', encoding='utf-8') as f:
        lines = [line.strip() for line in f.readlines() if line.strip()]

    categories = []
    current_category = None
    current_items = []
    
    # We will ignore standard header lines like "Item\tPrice" or "Seasonal Rates"
    
    # Need to keep track of a unique ID for each item
    item_id = 1
    
    # We can group some categories or just use the lines as categories.
    
    # Let's read line by line.
    # If line doesn't have a tab or is not matching item-price format, it might be a category.
    # Actually looking at the file:
    # "Veg Manchow Soup\t119"
    # Categories are lines like "SOUPS", "VEG", "NON-VEG"
    
    cat_prefix = ""
    main_cat = ""
    
    for line in lines:
        if line.startswith("//"): continue
        if line == "Item\tPrice": continue
        if line == "Seasonal Rates": continue
        
        parts = line.split('\t')
        if len(parts) == 2 and parts[1].isdigit():
            # It's an item
            name = parts[0].strip()
            price = int(parts[1].strip())
            
            cat_name = current_category if current_category else "Uncategorized"
            
            # Find if this category already exists in categories list
            cat_obj = next((c for c in categories if c['category'] == cat_name), None)
            if not cat_obj:
                cat_obj = {'category': cat_name, 'items': []}
                categories.append(cat_obj)
                
            cat_obj['items'].append({
                'id': item_id,
                'name': name,
                'price': price
            })
            item_id += 1
        elif len(parts) == 1:
            # It's a category
            cat_str = line.strip()
            # Handle SOUPS -> VEG / NON-VEG
            if cat_str in ["VEG", "NON-VEG", "NON VEG"]:
                if main_cat:
                    current_category = f"{main_cat} - {cat_str}"
                else:
                    current_category = cat_str
            else:
                main_cat = cat_str
                current_category = main_cat
                
            # If line doesn't have price but it's under SEA BASE SPECIAL TOWN
            pass
            
    # Clean up empty categories if any
    categories = [c for c in categories if len(c['items']) > 0]
    
    with open('parsed_menu.json', 'w', encoding='utf-8') as f:
        json.dump(categories, f, indent=2)

if __name__ == "__main__":
    parse_menu()
