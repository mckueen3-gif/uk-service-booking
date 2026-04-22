
import os

def replace_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content.replace('/dashboard/merchant', '/merchant')
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def walk_and_replace(root_dir):
    for root, dirs, files in os.walk(root_dir):
        if '.next' in root or 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.md')):
                replace_in_file(os.path.join(root, file))

walk_and_replace('src')
