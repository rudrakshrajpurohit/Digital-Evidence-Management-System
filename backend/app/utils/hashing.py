import hashlib
import os

def generate_file_hash(file_path: str) -> str:
    """
    Computes the SHA-256 hash of a file.
    Reads in chunks to handle large files efficiently.
    """
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def generate_chain_hash(action_data: str, previous_hash: str) -> str:
    """
    Computes the next hash in the chain-of-custody log.
    current_hash = SHA256(action_data + previous_hash)
    
    action_data should contain deterministic info like:
    "{evidence_id}|{user_id}|{action}|{timestamp.isoformat()}"
    """
    data = f"{action_data}{previous_hash}".encode("utf-8")
    return hashlib.sha256(data).hexdigest()
