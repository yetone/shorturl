"""Add demo URLs table

Revision ID: add_demo_urls_table
Revises: add_share_token_column
Create Date: 2025-11-09

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'add_demo_urls_table'
down_revision = 'add_share_token_column'
branch_labels = None
depends_on = None


def upgrade():
    # Create demo_urls table
    op.create_table(
        'demo_urls',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('original_url', sa.String(), nullable=True),
        sa.Column('short_code', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, default=datetime.utcnow),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index(op.f('ix_demo_urls_original_url'), 'demo_urls', ['original_url'], unique=False)
    op.create_index(op.f('ix_demo_urls_short_code'), 'demo_urls', ['short_code'], unique=True)
    op.create_index(op.f('ix_demo_urls_expires_at'), 'demo_urls', ['expires_at'], unique=False)


def downgrade():
    # Drop indexes
    op.drop_index(op.f('ix_demo_urls_expires_at'), table_name='demo_urls')
    op.drop_index(op.f('ix_demo_urls_short_code'), table_name='demo_urls')
    op.drop_index(op.f('ix_demo_urls_original_url'), table_name='demo_urls')

    # Drop table
    op.drop_table('demo_urls')
